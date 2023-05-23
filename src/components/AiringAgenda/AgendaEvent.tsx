import Tooltip from '@mui/material/Tooltip';

import { type AgendaAiring } from '../../@types';

interface AgendaEventProps {
  event: AgendaAiring;
}
function AgendaEvent({ event }: AgendaEventProps): JSX.Element {
  return (
    <Tooltip title={event.item_name}>
      <div>
        <header className="agenda-item-number__text">
          {event.item_number} - {event.airing_id}
        </header>
        <div className="agenda-item-name__text">{event.item_name}</div>
        <div className="agenda-item-show__text">
          {event.show} - {event.station}
        </div>
      </div>
    </Tooltip>
  );
}

export default AgendaEvent;
