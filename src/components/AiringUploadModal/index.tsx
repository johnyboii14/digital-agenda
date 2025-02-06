import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FileDropbox from './FileDropbox';
import RCTVSnackbar from '../Snackbar';
import { bulkCreateAirings, getAdminAirings } from '../../actions/airings';
import { useAppDispatch } from '../../config/hooks';
import { SNACKBAR_STATUSES } from '../../@types';

interface AiringData {
  airing_id: string;
  airing_type: string;
  airing_station: string;
  airing_date_time: string;
  airing_show: string;
  airing_item_number: string;
  airing_item_description: string;
  airing_price: number;
}

interface AiringUploadModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

function AiringUploadModal({ isOpen, handleClose }: AiringUploadModalProps): JSX.Element {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<AiringData[]>([]);
  const [snackbarOpen, setSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SNACKBAR_STATUSES>(SNACKBAR_STATUSES.SUCCESS);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const showSnackbar = (error: boolean, message: string): void => {
    setSnackbarSeverity(error ? SNACKBAR_STATUSES.ERROR : SNACKBAR_STATUSES.SUCCESS);
    setSnackbarMessage(message);
    setSnackbar(true);
  };

const handleCSVDrop = useCallback((acceptedFiles: File[]) => {
  if (acceptedFiles.length > 0) {
    const file = acceptedFiles[0];
    setCSVFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      Papa.parse<Record<string, string | undefined>>(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleanedData = (results.data as Record<string, string | undefined>[]).map(
            (row): AiringData | null => {
              if (!row["Date (PST)"] || !row["TimePST"]) {
                console.warn("Skipping row due to missing date/time:", row);
                return null;
              }

              // ✅ Extract the correct date (MM/DD/YYYY format)
              const rawDate = row["Date (PST)"]?.trim().split(" ")[0] ?? "";
              const rawTime = row["TimePST"]?.trim().split(" ")[1] ?? "";

              if (!rawDate.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/) || !rawTime.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
                console.warn("Invalid date/time format:", rawDate, rawTime);
                return null;
              }

              // ✅ Convert date into YYYY-MM-DD
              const [month, day, year] = rawDate.split("/");
              if (!month || !day || !year) return null;
              const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

              // ✅ Ensure time has leading zeros for HH:MM:SS format
              const timeParts = rawTime.split(":");
              const formattedTime = timeParts.map((part) => part.padStart(2, "0")).join(":");

              // ✅ Combine into a single datetime string in ISO format
              const localDateTimeStr = `${formattedDate}T${formattedTime}`;
              
              // ✅ Convert local time to UTC before sending
              const localDate = new Date(localDateTimeStr);
              const utcDateTimeStr = localDate.toISOString().slice(0, 19); // Remove milliseconds

              return {
                airing_id: row["AiringID"]?.trim() ?? "",
                airing_type: row["Type"]?.trim() ?? "Infomercial",
                airing_station: row["Station"]?.trim() ?? "",
                airing_date_time: utcDateTimeStr, // ✅ Sending UTC to backend
                airing_show: row["SHOW"]?.trim() ?? "",
                airing_item_number: row["ItemNumber"]?.trim() ?? "",
                airing_item_description: row["Item"]?.trim() ?? "",
                airing_price: parseFloat(row["Price"] ?? "0.00"),
              };
            }
          ).filter(Boolean) as AiringData[];

          setParsedData(cleanedData);
          console.log("✅ Cleaned & Converted Data (UTC):", cleanedData);
        },
      });
    };

    reader.readAsText(file);
  }
}, []);


  const clearCSV = (): void => {
    setCSVFile(null);
    setParsedData([]);
  };

  const handleUpload = async (): Promise<void> => {
    if (parsedData.length === 0) {
      showSnackbar(true, 'No valid data to upload');
      return;
    }

    setLoading(true);
    const res = await dispatch(bulkCreateAirings(parsedData));
    setLoading(false);

    if (res.type !== 'BULK_CREATE_AIRINGS/fulfilled') {
      showSnackbar(true, 'Unable to create airings');
      return;
    }

    showSnackbar(false, 'Successfully uploaded airings!');
    void dispatch(getAdminAirings());
    clearCSV();
  };

  return (
    <Modal open={isOpen}>
      <Box className="modal__container">
        <header className="modal__header">Airing Upload</header>
        <section>
          <FileDropbox onDrop={handleCSVDrop} />

          {csvFile !== null && (
            <article className="bulk-upload-btn__container">
              <header className="bulk-upload-btn__header">
                Uploaded <strong>{parsedData.length}</strong> Airings
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
          <Button variant="text" onClick={handleClose}>Close</Button>
          {parsedData.length > 0 && (
            <Button
              color="success"
              disabled={loading}
              onClick={handleUpload}
              variant="contained"
            >
              Upload Airings
            </Button>
          )}
        </footer>
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
