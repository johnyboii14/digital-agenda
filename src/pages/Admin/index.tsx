import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import AdminAiringTable from '../../components/AdminAiringTable';
import AiringUploadModal from '../../components/AiringUploadModal';
import EditAiringModal from '../../components/EditAiringModal';
import RCTVSnackbar from '../../components/Snackbar';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

import { useAppDispatch, useAppSelector } from '../../config/hooks';

import { deleteAiring, getAdminAirings } from '../../actions/airings';
import { signOut } from '../../actions/auth';

import blackLogo from '../../assets/images/RCTVBlackLogo.png';

import { type Airing, SNACKBAR_STATUSES } from '../../@types';

import './styles.scss';

function AdminPage(): JSX.Element {
  const [isUploadModalOpen, toggleUploadModal] = useState<boolean>(false);
  const [isDeleteModalOpen, toggleDeleteModal] = useState<boolean>(false);
  const [isUpdateModalOpen, toggleUpdateModal] = useState<boolean>(false);
  const [snackbarOpen, setSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SNACKBAR_STATUSES>(
    SNACKBAR_STATUSES.SUCCESS
  );
  const [airingToDelete, setAiringToDelete] = useState<Airing>();
  const [airingToUpdate, setAiringToUpdate] = useState<Airing>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const showSnackbar = (error: boolean, message: string): void => {
    const severity = error
      ? SNACKBAR_STATUSES.ERROR
      : SNACKBAR_STATUSES.SUCCESS;
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbar(true);
  };

  const handleCloseDeleteModal = (): void => {
    toggleDeleteModal(false);
    setAiringToDelete(undefined);
  };

  const handleCloseUpdateModal = (): void => {
    toggleUpdateModal(true);
    setAiringToUpdate(undefined);
  };

  const handleOpenUpdateModal = (airing: Airing): void => {
    toggleUpdateModal(true);
    setAiringToUpdate(airing);
  };

  const handleOpenDeleteModal = (airing: Airing): void => {
    toggleDeleteModal(true);
    setAiringToDelete(airing);
  };

  const confirmDeleteAiring = async (): Promise<void> => {
    if (airingToDelete !== undefined) {
      const res = await dispatch(deleteAiring(airingToDelete.ID));
      if (res.type === 'DELETE_AIRING/fulfilled') {
        showSnackbar(
          false,
          `Successfully deleted airing ${airingToDelete.airing_id}`
        );
        handleCloseDeleteModal();
        return;
      }

      showSnackbar(true, 'Unable to delete airing, please contact mike');
    }
  };

  const handleConfirmDelete = (): void => {
    void confirmDeleteAiring();
  };

  const airingStatus = useAppSelector(
    (state: { airings: { status: any } }) => state.airings.status
  );
  useEffect(() => {
    const rawUsername = localStorage.getItem('username');
    if (
      rawUsername == null ||
      rawUsername === undefined ||
      rawUsername === ''
    ) {
      navigate('/signin');
    }

    if (airingStatus === 'idle') {
      void dispatch(getAdminAirings());
    }
  }, [airingStatus, dispatch, navigate]);
  const handleSignOutClick = (): void => {
    signOut();
    navigate('/signin');
  };

  const handleOpenUploadModal = (): void => {
    toggleUploadModal(true);
  };

  const handleCloseUploadModal = (): void => {
    toggleUploadModal(false);
  };

  return (
    <div id="admin-page__container">
      <menu>
        <header>
          <img className="sidebar-logo" src={blackLogo} alt="RCTV Header" />
        </header>
        <ul>
          <li style={{ marginBottom: '10%' }}>
            <Button
              className="selected"
              variant="text"
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              onClick={handleOpenUploadModal}
              variant="text"
              startIcon={<AddIcon />}
            >
              Upload Airings
            </Button>
          </li>
        </ul>
      </menu>
      <main>
        <header>
          <h1 className="admin-header__text">Digital Agenda Admin</h1>
          <Button
            variant="contained"
            onClick={handleSignOutClick}
            endIcon={<ExitToAppIcon />}
            sx={{ backgroundColor: '#D17253' }}
          >
            Sign Out
          </Button>
        </header>
        <AdminAiringTable
          handleEditClick={handleOpenUpdateModal}
          handleDeleteClick={handleOpenDeleteModal}
        />
        <div className="admin-vignette" />
      </main>
      <AiringUploadModal
        isOpen={isUploadModalOpen}
        handleClose={handleCloseUploadModal}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        handleClose={handleCloseDeleteModal}
        deleteMessage="Are you sure you want to delete this airing?"
        handleDelete={handleConfirmDelete}
      />
      {airingToUpdate !== undefined && (
        <EditAiringModal
          isOpen={isUpdateModalOpen}
          airingToEdit={airingToUpdate}
          showSnackbar={showSnackbar}
          handleClose={handleCloseUpdateModal}
        />
      )}
      <RCTVSnackbar
        isOpen={snackbarOpen}
        severity={snackbarSeverity}
        setSnackbar={setSnackbar}
        snackbarMessage={snackbarMessage}
      />
    </div>
  );
}

export default AdminPage;
