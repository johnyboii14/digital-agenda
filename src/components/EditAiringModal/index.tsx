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
    type,
    station,
    airing_time: initialAiringTime,
    show,
    item_number: initialItemNumber,
    item_name: initialItemName,
    price,
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
    type: type ?? '',
    station: station ?? '',
    airing_time: initialAiringTimeFormatted ?? '',
    show: show ?? '',
    item_number: initialItemNumber ?? '',
    item_name: initialItemName ?? '',
    price: price ?? 0,
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
      key: 'type',
      value: airingToUpdate.type ?? '',
      initialValue: initialAiringForm.type,
    },
    {
      label: 'Station',
      key: 'station',
      value: airingToUpdate.station ?? '',
      initialValue: initialAiringForm.station,
    },
    {
      label: 'Airing Time',
      key: 'airing_time',
      value: airingToUpdate.airing_time ?? '',
      initialValue: initialAiringForm.airing_time,
    },
    {
      label: 'Show',
      key: 'show',
      value: airingToUpdate.show ?? '',
      initialValue: initialAiringForm.show,
    },
    {
      label: 'Item Number',
      key: 'item_number',
      value: airingToUpdate.item_number ?? '',
      initialValue: initialAiringForm.item_number,
    },
    {
      label: 'Item Name',
      key: 'item_name',
      value: airingToUpdate.item_name ?? '',
      initialValue: initialAiringForm.item_name,
    },
    {
      label: 'Price',
      key: 'price',
      value: airingToUpdate.price ?? 0,
      initialValue: initialAiringForm.price,
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
      showSnackbar(false, `Successfully updated ${airingToUpdate.item_name}`);
      handleClose();
      setTimeout(() => {
        window.location.reload();
      }, 2000)
      return;
    }

    showSnackbar(
      true,
      `Failed to update ${airingToEdit.item_name}, please contact Mike or Jonathan`
    );
  };

  const handleEditConfirm = (): void => {
    // Convert the displayed airing time back to a Date object in UTC
    const [datePart, timePart] = airingToUpdate.airing_time.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hourMinute, period] = timePart.split(' ');
    const [hour, minute] = hourMinute.split(':');
    const hour24 = period.toLowerCase() === 'pm' ? (parseInt(hour, 10) % 12) + 12 : parseInt(hour, 10);

    const formattedAiringTime = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hour24, parseInt(minute, 10))).toISOString();

    // Create airing obj
    const dataObj: AiringUpdateData = {
      ...airingToUpdate,
      airing_time: formattedAiringTime,
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
            Edit {airingToEdit.item_name}
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
