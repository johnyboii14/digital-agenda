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
  const initialAiringForm: AiringFormData = {
    airing_id: initialAiringId,
    type,
    station,
    airing_time: initialAiringTime,
    show,
    item_number: initialItemNumber,
    item_name: initialItemName,
    price,
  };
  const [airingToUpdate, updateAiringForm] =
    useState<AiringFormData>(initialAiringForm);
  const FORM_FIELDS: FormField[] = [
    {
      label: 'Airing ID',
      key: 'airing_id',
      value: airingToUpdate?.airing_id,
      initialValue: airingToEdit.airing_id,
    },
    {
      label: 'Type',
      key: 'type',
      value: airingToUpdate?.type,
      initialValue: airingToEdit.type,
    },
    {
      label: 'Station',
      key: 'station',
      value: airingToUpdate?.station,
      initialValue: airingToEdit.station,
    },
    {
      label: 'Airing Time',
      key: 'airing_time',
      value: airingToUpdate?.airing_time,
      initialValue: airingToEdit.airing_time,
    },
    {
      label: 'Show',
      key: 'show',
      value: airingToUpdate?.show,
      initialValue: airingToEdit.show,
    },
    {
      label: 'Item Number',
      key: 'item_number',
      value: airingToUpdate?.item_number,
      initialValue: airingToEdit.item_number,
    },
    {
      label: 'Item Name',
      key: 'item_name',
      value: airingToUpdate?.item_name,
      initialValue: airingToEdit.item_name,
    },
    {
      label: 'Price',
      key: 'price',
      value: airingToUpdate?.price,
      initialValue: airingToEdit.price,
      type: 'number',
    },
  ];
  const dataFields = FORM_FIELDS.map((f: FormField): JSX.Element => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const copyOfState = JSON.parse(JSON.stringify(airingToUpdate));
      copyOfState[f.key] = e.target.value;
      updateAiringForm(copyOfState);
    };

    if (f.type === null || f.type === undefined) {
      return (
        <TextField
          value={f.value}
          key={f.label}
          helperText={`Existing ${f.label}: ${f.initialValue}`}
          variant="standard"
          onChange={handleOnChange}
          label={f.label}
        />
      );
    }

    if (f.type === 'number') {
      return (
        <TextField
          value={f.value}
          key={f.label}
          helperText={`Existing ${f.label}: ${f.initialValue}`}
          variant="standard"
          onChange={handleOnChange}
          label={f.label}
          type={f.type}
        />
      );
    }

    return (
      <TextField
        value={f.value}
        key={f.label}
        helperText={`Existing ${f.label}: ${f.initialValue}`}
        variant="standard"
        onChange={handleOnChange}
        label={f.label}
      />
    );
  });
  const updateAiring = async (): Promise<void> => {
    // Create airing obj
    const dataObj: AiringUpdateData = {
      ...airingToUpdate,
      ID: airingToEdit.ID,
    };
    // Dispatch edit
    const res = await dispatch(editAiring(dataObj));
    // Show snackbar
    if (res.meta.requestStatus === 'fulfilled') {
      void dispatch(getAdminAirings());
      showSnackbar(false, `Successfully updated ${airingToUpdate.item_name}`);
      handleClose();
      return;
    }

    showSnackbar(
      true,
      `Failed to update ${airingToEdit.item_name}, please contact Mike or jonathan`
    );
  };

  const handleEditConfirm = (): void => {
    void updateAiring();
  };

  return (
    <Modal open={isOpen}>
      <Box>
        <div className="modal__container" id="delete-modal">
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
