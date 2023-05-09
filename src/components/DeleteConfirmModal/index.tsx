import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  handleClose: () => void;
  deleteMessage: string;
  handleDelete: Function;
}

function DeleteConfirmModal({
  isOpen,
  handleClose,
  deleteMessage,
  handleDelete,
}: DeleteConfirmModalProps) {
  return (
    <Modal open={isOpen}>
      <Box>
        <div className="modal__container" id="delete-modal">
          <header className="modal__header">Delete Confirmation</header>
          <section className="modal__summary">
            <article className="modal__instructions">
              <summary>{deleteMessage}</summary>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
            </article>
          </section>
          <footer>
            <Button
              variant="text"
              color="info"
              style={{ color: "grey" }}
              onClick={() => handleClose()}
            >
              Close
            </Button>
          </footer>
        </div>
      </Box>
    </Modal>
  );
}

export default DeleteConfirmModal;
