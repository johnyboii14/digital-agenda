import Tooltip from '@mui/material/Tooltip';

import { type AgendaAiring } from '../../@types';

interface AgendaEventProps {
  event: AgendaAiring;
}
function AgendaEvent({ event }: AgendaEventProps): JSX.Element {
  return (
    <Tooltip title={event.airing_item_description}>
      <div style={{ minHeight: '120px' }}>
        <header className="agenda-item-number__text">
          {event.airing_item_number} - {event.airing_id}
        </header>
        <div className="agenda-item-name__text">{event.airing_item_description}</div>
        <div className="agenda-item-show__text">
          {event.airing_show} - {event.airing_station}
        </div>
      </div>
    </Tooltip>
  );
}

export default AgendaEvent;
