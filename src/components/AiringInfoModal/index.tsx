import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import type { AgendaAiring, DefaultModalProps } from '../../@types';
import formatDateInPST from '../../helpers/formatDate';

import './styles.scss';

interface AiringInfoModalProps extends DefaultModalProps {
  airingToPreview: AgendaAiring;
}
function AiringInfoModal({
  airingToPreview,
  isOpen,
  handleClose,
}: AiringInfoModalProps): JSX.Element {
  const {
    airing_item_description: itemName,
    airing_item_number: itemNumber,
    airing_id: airingId,
    airing_price: airingPrice,
    airing_date_time: airingTime,
    airing_station: airingStation,
    airing_type: airingType,
  } = airingToPreview;
  return (
    <Modal onClose={handleClose} open={isOpen}>
      <Box>
        <div className="modal__container airing-info-modal__container">
          <header className="modal__header airing-info-main__header">
            {itemName}
          </header>
          <div className="airing-info__container">
            <section className="airing-info__row">
              <article>
                <header className="airing-info__header">Item Number</header>
                {itemNumber}
              </article>
              <article>
                <header className="airing-info__header">Airing ID</header>
                {airingId}
              </article>
              <article>
                <header className="airing-info__header">Price</header>
                {airingPrice}
              </article>
            </section>
            <section className="airing-info__row">
              <article>
                <header className="airing-info__header">Airing Time</header>
                {formatDateInPST(airingTime)}
              </article>
              <article>
                <header className="airing-info__header">Station</header>
                {airingStation}
              </article>
            </section>
            <section className="airing-info__row">
              <article>
                <header className="airing-info__header">Type</header>
                {airingType}
              </article>
            </section>
          </div>
          <footer>
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

export default AiringInfoModal;
