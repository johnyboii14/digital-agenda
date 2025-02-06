import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import {
  type Airing,
  type AiringFormData,
  type AiringUpdateData,
} from '../../@types';

import { useAppDispatch } from '../../config/hooks';
import { getAdminAirings, editAiring } from '../../actions/airings';

interface EditAiringModalProps {
  isOpen: boolean;
  handleClose: () => void;
  airingToEdit: Airing;
  showSnackbar: (isError: boolean, status: string) => void;
}

interface FormField {
  label: string;
  key: keyof AiringFormData;
  value: string | number;
  initialValue: string | number;
  type?: string;
}

function EditAiringModal({
  isOpen,
  handleClose,
  airingToEdit,
  showSnackbar,
}: EditAiringModalProps): JSX.Element {
  const dispatch = useAppDispatch();
  const {
    airing_id: initialAiringId,
    airing_type: airingType,
    airing_station: airingStation,
    airing_date_time: initialAiringTime,
    airing_show: airingShow,
    airing_item_number: initialItemNumber,
    airing_item_description: initialItemName,
    airing_price: airingPrice,
  } = airingToEdit;

  // Parse the initial airing time as a Date object in UTC
  const initialAiringTimeDate = new Date(initialAiringTime);

  // Format the airing time for display in local time zone
  const initialAiringTimeFormatted = initialAiringTimeDate.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const initialAiringForm: AiringFormData = {
    airing_id: initialAiringId ?? '',
    airing_type: airingType ?? '',
    airing_station: airingStation ?? '',
    airing_date_time: initialAiringTimeFormatted ?? '',
    airing_show: airingShow ?? '',
    airing_item_number: initialItemNumber ?? '',
    airing_item_description: initialItemName ?? '',
    airing_price: airingPrice ?? 0,
  };

  const [airingToUpdate, updateAiringForm] = useState<AiringFormData>(initialAiringForm);

  const FORM_FIELDS: FormField[] = [
    {
      label: 'Airing ID',
      key: 'airing_id',
      value: airingToUpdate.airing_id ?? '',
      initialValue: initialAiringForm.airing_id,
    },
    {
      label: 'Type',
      key: 'airing_type',
      value: airingToUpdate.airing_type ?? '',
      initialValue: initialAiringForm.airing_type,
    },
    {
      label: 'Station',
      key: 'airing_station',
      value: airingToUpdate.airing_station ?? '',
      initialValue: initialAiringForm.airing_station,
    },
    {
      label: 'Airing Time',
      key: 'airing_date_time',
      value: airingToUpdate.airing_date_time ?? '',
      initialValue: initialAiringForm.airing_date_time,
    },
    {
      label: 'Show',
      key: 'airing_show',
      value: airingToUpdate.airing_show ?? '',
      initialValue: initialAiringForm.airing_show,
    },
    {
      label: 'Item Number',
      key: 'airing_item_number',
      value: airingToUpdate.airing_item_number ?? '',
      initialValue: initialAiringForm.airing_item_number,
    },
    {
      label: 'Item Name',
      key: 'airing_item_description',
      value: airingToUpdate.airing_item_description ?? '',
      initialValue: initialAiringForm.airing_item_description,
    },
    {
      label: 'Price',
      key: 'airing_price',
      value: airingToUpdate.airing_price ?? 0,
      initialValue: initialAiringForm.airing_price,
      type: 'number',
    },
  ];

  const dataFields = FORM_FIELDS.map((f: FormField): JSX.Element => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      updateAiringForm(prevState => ({
        ...prevState,
        [f.key]: e.target.value,
      }));
    };

    return (
      <TextField
        value={f.value}
        key={f.label}
        helperText={`Existing ${f.label}: ${f.initialValue}`}
        variant="standard"
        onChange={handleOnChange}
        label={f.label}
        type={f.type ?? 'text'}
      />
    );
  });

  const updateAiring = async (dataObj: AiringUpdateData): Promise<void> => {
    // Dispatch edit
    const res = await dispatch(editAiring(dataObj));
    // Show snackbar
    if (res.meta.requestStatus === 'fulfilled') {
      void dispatch(getAdminAirings());
      showSnackbar(false, `Successfully updated ${airingToUpdate.airing_item_description}`);
      handleClose();
      setTimeout(() => {
        window.location.reload();
      }, 2000)
      return;
    }

    showSnackbar(
      true,
      `Failed to update ${airingToEdit.airing_item_description}, please contact Mike or Jonathan`
    );
  };

  const handleEditConfirm = (): void => {
    // Convert the displayed airing time back to a Date object in UTC
    const [datePart, timePart] = airingToUpdate.airing_date_time.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hourMinute, period] = timePart.split(' ');
    const [hour, minute] = hourMinute.split(':');
    const hour24 = period.toLowerCase() === 'pm' ? (parseInt(hour, 10) % 12) + 12 : parseInt(hour, 10);

    const formattedAiringTime = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hour24, parseInt(minute, 10))).toISOString();

    // Create airing obj
    const dataObj: AiringUpdateData = {
      ...airingToUpdate,
      airing_date_time: formattedAiringTime,
      ID: airingToEdit.ID,
    };

    // Dispatch edit
    void updateAiring(dataObj);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box>
        <div className="modal__container" id="edit-modal">
          <header className="modal__header">
            Edit {airingToEdit.airing_item_description}
          </header>
          <section className="quick-edit__form__wrapper">
            <form className="quick-edit__form">{dataFields}</form>
          </section>
          <footer>
            <Button
              variant="contained"
              color="success"
              onClick={handleEditConfirm}
            >
              Edit Airing
            </Button>
            <Button
              variant="text"
              color="info"
              style={{ color: 'grey' }}
              onClick={handleClose}
            >
              Close
            </Button>
          </footer>
        </div>
      </Box>
    </Modal>
  );
}

export default EditAiringModal;
