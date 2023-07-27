import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import type { AgendaAiring, DefaultModalProps } from '../../@types';

interface AiringInfoModalProps extends DefaultModalProps {
  airingToPreview: AgendaAiring;
}
function AiringInfoModal({
  isOpen,
  handleClose,
  showSnackbar,
}: AiringInfoModalProps): JSX.Element {
  return (
    <Modal onClose={handleClose} open={isOpen}>
      <Box>
        <div className="modal__container">
          <footer> </footer>
        </div>
      </Box>
    </Modal>
  );
}

export default AiringInfoModal;
