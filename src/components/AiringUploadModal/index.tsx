import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import FileDropbox from './FileDropbox';
import RCTVSnackbar from '../Snackbar';

import { bulkCreateAirings, getAdminAirings } from '../../actions/airings';

import { useAppDispatch } from '../../config/hooks';
import {
  type AiringCSVData,
  type BulkCreateAiringBody,
  type CreateAiringBody,
  SNACKBAR_STATUSES,
} from '../../@types';
import cleanUpString from '../../helpers/cleanUpString';

interface AiringUploadModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

type Hashmap = {
  [key in keyof AiringCSVData]: keyof CreateAiringBody;
};

const hashmap: Hashmap = {
  AiringID: 'airing_id',
  Type: 'type',
  Station: 'station',
  'Date (PST)': 'airing_time',
  TimePST: 'airing_time',
  SHOW: 'show',
  ItemNumber: 'item_number',
  Item: 'item_name',
  Price: 'price',
};

function AiringUploadModal({
  isOpen,
  handleClose,
}: AiringUploadModalProps): JSX.Element {
  const [csvFiles, setCSVFiles] = useState<AiringCSVData[]>([]);
  const [snackbarOpen, setSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SNACKBAR_STATUSES>(
    SNACKBAR_STATUSES.SUCCESS
  );
  const [loading, setLoading] = useState<boolean>(false);
  const resetState = (): void => {
    setCSVFiles([]);
    setLoading(false);
  };

  const dispatch = useAppDispatch();
  const showSnackbar = (error: boolean, message: string): void => {
    const severity = error
      ? SNACKBAR_STATUSES.ERROR
      : SNACKBAR_STATUSES.SUCCESS;
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbar(true);
  };

  const handleUpload = async (): Promise<void> => {
    setLoading(true);
    const data: CreateAiringBody[] = [];
    for (let i = 0; i < csvFiles.length; i += 1) {
      const obj: Record<keyof CreateAiringBody, string | number> = {
        airing_time: '',
        airing_id: '',
        type: 'Infomercial',
        station: '',
        show: '',
        item_number: '',
        item_name: '',
        price: 0,
      };
      const csvData: AiringCSVData = csvFiles[i];
      Object.keys(csvData).forEach((key) => {
        const airingKey = hashmap[key as keyof AiringCSVData];
        if (key === 'Date (PST)') {
          obj.airing_time = `${csvData['Date (PST)']}T`;
        } else if (key === 'TimePST') {
          obj.airing_time = `${obj.airing_time}${csvData.TimePST}.000Z`;
        } else {
          const value = csvData[key as keyof AiringCSVData];
          obj[airingKey] = value;
        }
      });
      data.push(obj as CreateAiringBody);
    }

    // Do bulk upload
    let username = localStorage.getItem('username');
    if (username == null || username === undefined || username === '') {
      username = 'default';
    } else {
      username = username.toString();
    }

    const csvAiringData: BulkCreateAiringBody = {
      data,
      user: username,
    };
    const res = await dispatch(bulkCreateAirings(csvAiringData));
    // Get response
    setLoading(false);
    if (res.type !== 'BULK_CREATE_AIRINGS/fulfilled') {
      // Handle error
      showSnackbar(true, 'Unable to create airings');
      return;
    }

    // Handle success
    showSnackbar(false, 'Successfully uploaded airings!');
    // Call get admin products
    void dispatch(getAdminAirings());
    resetState();
  };

  const handleCSVDrop = useCallback((acceptedFile: File[]): void => {
    acceptedFile.forEach((file: File) => {
      const reader: FileReader = new FileReader();

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target != null) {
          const csv = ev.target.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',') as Array<keyof AiringCSVData>;
          const data: AiringCSVData[] = [];
          for (let i = 1; i < lines.length; i += 1) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
              const obj: AiringCSVData = {
                AiringID: '',
                Type: '',
                Station: '',
                'Date (PST)': '',
                TimePST: '',
                SHOW: '',
                ItemNumber: '',
                Item: '',
                Price: '',
              };
              for (let j = 0; j < values.length; j++) {
                if (cleanUpString(headers[j]) === 'Date (PST)') {
                  const [date] = values[j].split(' ');
                  const parts = date.split('/');
                  const year = parts[2];
                  const month = parts[0].padStart(2, '0');
                  const day = parts[1].padStart(2, '0');
                  const isoDateStr = `${year}-${month}-${day}`;
                  obj[cleanUpString(headers[j]) as keyof AiringCSVData] =
                    isoDateStr;
                } else if (cleanUpString(headers[j]) === 'TimePST') {
                  const time = values[j].split(' ')[1];
                  obj[cleanUpString(headers[j]) as keyof AiringCSVData] = time;
                } else {
                  obj[cleanUpString(headers[j]) as keyof AiringCSVData] =
                    cleanUpString(values[j]);
                }
              }

              data.push(obj);
            }
          }

          setCSVFiles(data);
        }
      };

      reader.readAsBinaryString(file);
    });
  }, []);

  const clearCSV = (): void => {
    setCSVFiles([]);
  };

  const handleUploadClick = (): void => {
    void handleUpload();
  };

  const hasUploadedFiles = csvFiles.length > 1;
  return (
    <Modal open={isOpen}>
      <Box>
        <div className="modal__container">
          <header className="modal__header">Airing Upload</header>
          <section>
            <article className="modal-instructions__container">
              <h4 className="modal-instructions__text">
                Here you can drag and drop your airing files. Data will either
                be created or updated based on if the airing id already exists
                in the database
              </h4>
            </article>
            <FileDropbox onDrop={handleCSVDrop} />
            {hasUploadedFiles && (
              <article className="bulk-upload-btn__container">
                <header className="bulk-upload-btn__header">
                  Uploaded {csvFiles.length - 1} Airings
                </header>
                <article className="bulk-upload-btn__clear">
                  <Button
                    variant="text"
                    sx={{ color: '#f0ad4e' }}
                    onClick={clearCSV}
                  >
                    Clear X
                  </Button>
                </article>
              </article>
            )}
          </section>
          <footer>
            <Button variant="text" onClick={handleClose}>
              Close
            </Button>
            {hasUploadedFiles && (
              <Button
                color="success"
                disabled={loading}
                onClick={handleUploadClick}
                variant="contained"
              >
                Upload Airings
              </Button>
            )}
          </footer>
        </div>
        <RCTVSnackbar
          isOpen={snackbarOpen}
          severity={snackbarSeverity}
          setSnackbar={setSnackbar}
          snackbarMessage={snackbarMessage}
        />
      </Box>
    </Modal>
  );
}

export default AiringUploadModal;
