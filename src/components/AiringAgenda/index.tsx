import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import momentTz from 'moment-timezone';

import AgendaEvent from './AgendaEvent';

import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { getDayAgendaAirings } from '../../actions/airings';
import { type AgendaAiring } from '../../@types';

const localizer = momentLocalizer(moment);

interface EventProps {
  event: AgendaAiring;
}
const MyAgendaEvent = ({ event }: EventProps): JSX.Element => {
  return <AgendaEvent key={event.ID} event={event} />;
};

const LA_TIMEZONE = 'America/Los_Angeles';
function AgendaCalendar(): JSX.Element {
  const dispatch = useAppDispatch();
  const agendaStatus = useAppSelector((state) => state.airings.agendaStatus);
  const formatSelectedDate = (date: Date): string => {
    // Format the date to "yyyy-mm-dd" in the target time zone
    const formattedDate = momentTz(date).tz(LA_TIMEZONE).format('YYYY-MM-DD');
    return formattedDate;
  };
  const airings: AgendaAiring[] = useAppSelector(
    (state) => state.airings.agendaAirings
  ).map((airing) => {
    const timezoneRemovedVal = airing.airing_time.slice(
      0,
      airing.airing_time.length - 4
    );
    const airingDate = momentTz(timezoneRemovedVal).tz(LA_TIMEZONE).toDate();
    const endDate = momentTz(timezoneRemovedVal).tz(LA_TIMEZONE).toDate();
    endDate.setMinutes(endDate.getMinutes() + 30);
    return {
      ...airing,
      end_date: endDate,
      airing_start_date: airingDate,
    };
  });
  const handleNavigate = (date: Date): void => {
    dispatch(getDayAgendaAirings(formatSelectedDate(date)));
  };

  useEffect(() => {
    if (agendaStatus === 'idle') {
      dispatch(getDayAgendaAirings(formatSelectedDate(new Date())));
    }
  }, [agendaStatus, dispatch]);
  const eventStyleGetter = (event: AgendaAiring): any => {
    // Your logic to conditionally determine the background color based on the airing details
    let className = '';

    if (event.station.toLowerCase().includes('bloomberg')) {
      className += 'bloomberg-rbc-event';
    }
    if (event.station.toLowerCase().includes('fox')) {
      className += 'fox-rbc-event';
    }

    if (event.station.toLowerCase() === 'fx') {
      className += 'fx-rbc-event';
    }

    if (event.station.toLowerCase() === 'history channel') {
      className += 'history-channel-rbc-event';
    }

    if (event.station.toLowerCase() === 'nat geo wild') {
      className += 'nat-geo-wild-rbc-event';
    }

    return {
      className,
    };
  };

  return (
    <Calendar<AgendaAiring>
      localizer={localizer}
      startAccessor="airing_start_date"
      endAccessor="end_date"
      onNavigate={handleNavigate}
      events={airings}
      eventPropGetter={eventStyleGetter}
      selectable
      components={{
        day: {
          event: MyAgendaEvent,
        },
      }}
      view="day"
      timeslots={1}
      step={30}
      onView={() => null}
      tooltipAccessor={(airing: AgendaAiring) => airing.item_name}
      views={['day']}
      style={{ height: 1000, padding: '0 3%' }}
    />
  );
}

export default AgendaCalendar;
