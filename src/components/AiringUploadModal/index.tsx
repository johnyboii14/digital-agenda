import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Papa from 'papaparse';
import FileDropbox from './FileDropbox';
import RCTVSnackbar from '../Snackbar';
import {
  bulkCreateAirings,
  chunkCreateAirings,
  confirmChunkCreateAirings,
  getAdminAirings,
} from '../../actions/airings';
import { useAppDispatch } from '../../config/hooks';
import {
  type AiringCSVData,
  type BulkCreateAiringBody,
  type CreateAiringBody,
  SNACKBAR_STATUSES,
  type ChunkCreateAiringBody,
  type ChunkCreateAiringConfirmBody,
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<SNACKBAR_STATUSES>(SNACKBAR_STATUSES.SUCCESS);
  const [loading, setLoading] = useState<boolean>(false);
  const resetState = (): void => {
    setCSVFiles([]);
    setLoading(false);
  };

  const dispatch = useAppDispatch();
  const showSnackbar = (error: boolean, message: string): void => {
    const severity = error ? SNACKBAR_STATUSES.ERROR : SNACKBAR_STATUSES.SUCCESS;
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbar(true);
  };

  const removeCommas = (str: string): string => str.replace(/,/g, ' ');

  const handleUpload = async (): Promise<void> => {
    setLoading(true);
    const data: CreateAiringBody[] = [];
    
    console.log('Total CSV Files:', csvFiles.length);
  
    for (let i = 0; i < csvFiles.length; i += 1) {
      const obj: Record<keyof CreateAiringBody, string | number> = {
        airing_time: '',
        airing_id: '',
        type: '',
        station: '',
        show: '',
        item_number: '',
        item_name: '',
        price: 0,
      };
      const csvData: AiringCSVData = csvFiles[i];
      Object.keys(csvData).forEach((key) => {
        const airingKey = hashmap[key as keyof AiringCSVData];
        if (key === 'Date (PST)' || key === 'TimePST') {
          // Skip handling here; combine later
        } else {
          let value = csvData[key as keyof AiringCSVData];
          if (key === 'SHOW' || key === 'Item') {
            value = removeCommas(value);
          }
          obj[airingKey] = value;
        }
      });
  
      // Combine the date and time into a single ISO string for airing_time
      const datePart = csvData['Date (PST)'];
      const timePart = csvData.TimePST;
      if (datePart !== '' && timePart !== '') {
        obj.airing_time = `${datePart}T${timePart}.000Z`;
      }
  
      data.push(obj as CreateAiringBody);
    }
  
    console.log('Total Airings Prepared for Upload:', data.length);
  
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
  
    if (data.length > 700) {
      // Chunk data here and make API calls here
      const chunkSize = 3000;
      const chunkedData: CreateAiringBody[][] = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        chunkedData.push(chunk);
      }
  
      console.log('Total Chunks Prepared for Upload:', chunkedData.length);
  
      try {
        const promises = chunkedData.map((chunk, index) => {
          console.log(`Uploading Chunk ${index + 1}/${chunkedData.length}`);
          const chunkedCSVAiringData: ChunkCreateAiringBody = {
            data: chunk,
          };
          return dispatch(chunkCreateAirings(chunkedCSVAiringData));
        });
  
        const responses = await Promise.all(promises);
  
        if (responses.some((res) => res.type !== 'CHUNK_CREATE_AIRINGS/fulfilled')) {
          // Handle error
          showSnackbar(true, 'Unable to create airings');
          setLoading(false);
          return;
        }
        // All API calls succeeded
        showSnackbar(false, `Successfully uploaded airings! The agenda now has ${data.length} airings`);
        // Call get admin products
        const chunkConfirmBody: ChunkCreateAiringConfirmBody = {
          user: username,
        };
        void dispatch(confirmChunkCreateAirings(chunkConfirmBody));
        void dispatch(getAdminAirings());
        resetState();
      } catch (error) {
        // Handle error
        console.error('Error while uploading chunks:', error);
        showSnackbar(true, 'Error while uploading airings');
        resetState();
      }
    } else {
      const res = await dispatch(bulkCreateAirings(csvAiringData));
      // Get response
      setLoading(false);
      if (res.type !== 'BULK_CREATE_AIRINGS/fulfilled') {
        // Handle error
        showSnackbar(true, 'Unable to create airings');
        return;
      }
  
      // Handle success
      const chunkConfirmBody: ChunkCreateAiringConfirmBody = {
        user: username,
      };
      void dispatch(confirmChunkCreateAirings(chunkConfirmBody));
      showSnackbar(false, 'Successfully uploaded airings!');
      // Call get admin products
      void dispatch(getAdminAirings());
      resetState();
    }
  };

  const handleCSVDrop = useCallback((acceptedFile: File[]): void => {
    acceptedFile.forEach((file: File) => {
      const reader: FileReader = new FileReader();
  
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target != null) {
          const csv = ev.target.result as string;
          Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const data: AiringCSVData[] = result.data.map((row: any) => {
                const cleanedRow: AiringCSVData = {
                  AiringID: row.AiringID !== undefined && row.AiringID !== null ? row.AiringID : '',
                  Type: row.Type !== undefined && row.Type !== null ? row.Type : '',
                  Station: row.Station !== undefined && row.Station !== null ? row.Station : '',
                  'Date (PST)': row['Date (PST)'] !== undefined && row['Date (PST)'] !== null ? cleanUpString(row['Date (PST)']) : '',
                  TimePST: row.TimePST !== undefined && row.TimePST !== null ? cleanUpString(row.TimePST) : '',
                  SHOW: row.SHOW !== undefined && row.SHOW !== null ? removeCommas(row.SHOW) : '',
                  ItemNumber: row.ItemNumber !== undefined && row.ItemNumber !== null ? row.ItemNumber : '',
                  Item: row.Item !== undefined && row.Item !== null ? removeCommas(row.Item) : '',
                  Price: row.Price !== undefined && row.Price !== null ? row.Price : '',
                };
  
                // Process 'Date (PST)' and 'TimePST' fields
                if (cleanedRow['Date (PST)'] !== '') {
                  const [date] = cleanedRow['Date (PST)'].split(' ');
                  const parts = date.split('/');
                  const year = parts[2];
                  const month = parts[0].padStart(2, '0');
                  const day = parts[1].padStart(2, '0');
                  cleanedRow['Date (PST)'] = `${year}-${month}-${day}`;
                }
  
                if (cleanedRow.TimePST !== '') {
                  const timeParts = cleanedRow.TimePST.split(' ');
                  if (timeParts.length > 1) {
                    cleanedRow.TimePST = timeParts[1];
                  }
                }
  
                return cleanedRow;
              });
  
              setCSVFiles(data);
            },
          });
        }
      };
  
      reader.readAsText(file);
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
