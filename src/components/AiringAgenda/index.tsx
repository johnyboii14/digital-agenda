import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { parseISO } from 'date-fns';

import AgendaEvent from './AgendaEvent';
import AiringInfoModal from '../AiringInfoModal';

import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { getDayAgendaAirings } from '../../actions/airings';
import { type AgendaAiring } from '../../@types';
import { AIRING_DAY, DEFAULT_TIMEZONE } from '../../constants';

const localizer = momentLocalizer(moment);

interface EventProps {
  event: AgendaAiring;
}

const MyAgendaEvent = ({ event }: EventProps): JSX.Element => {
  return <AgendaEvent key={event.ID} event={event} />;
};

function AgendaCalendar(): JSX.Element {
  const [isAiringInfoModalOpen, toggleAiringInfoModal] =
    useState<boolean>(false);
  const [airingToPreview, setAiringToPreview] = useState<AgendaAiring>();

  const rawAiringDay: string | null = localStorage.getItem(AIRING_DAY);
  let initialAiringDay: Date = new Date();
  if (rawAiringDay !== null) {
    initialAiringDay = new Date(rawAiringDay);
  }

  const [agendaDate, setAgendaDate] = useState<Date | string>(initialAiringDay);
  const dispatch = useAppDispatch();

  const formatSelectedDate = (date: Date | string): string => {
    return momentTz(date).tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD');
  };

  const eventStyleGetter = (event: AgendaAiring): any => {
    let className = '';

    if (event.airing_type === 'ShoppingBlock') {
      className += 'shopping-block-event ';
    }

    if (event.airing_station.toLowerCase().includes('bloomberg')) {
      className += 'bloomberg-rbc-event';
    }
    if (event.airing_station.toLowerCase().includes('fox')) {
      className += 'fox-rbc-event';
    }
    if (event.airing_station.toLowerCase().includes('nbc')) {
      className += 'nbc-rbc-event';
    }
    if (event.airing_station.toLowerCase().includes('stadium')) {
      className += 'stadium-rbc-event';
    }
    if (event.airing_station.toLowerCase().includes('comet')) {
      className += 'comet-rbc-event';
    }
    if (event.airing_station.toLowerCase().includes('vice')) {
      className += 'vice-rbc-event';
    }

    if (event.airing_station.toLowerCase() === 'fx') {
      className += 'fx-rbc-event';
    }

    if (event.airing_station.toLowerCase() === 'history channel') {
      className += 'history-channel-rbc-event';
    }

    if (event.airing_station.toLowerCase() === 'nat geo wild') {
      className += 'nat-geo-wild-rbc-event';
    }

    return {
      className,
    };
  };

  const majorStations = [
    'bloomberg',
    'fox',
    'nbc',
    'stadium',
    'comet',
    'vice',
    'fx',
    'history channel',
    'nat geo wild',
  ];

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const airings: AgendaAiring[] = useAppSelector(
    (state) => state.airings.agendaAirings
  )
    .map((airing) => {
      // ✅ Convert UTC date to the user's local time
      const airingDate = new Date(airing.airing_date_time + 'Z'); // Ensure UTC interpretation
      const localStartDate = new Date(
        airingDate.toLocaleString('en-US', { timeZone: userTimeZone })
      );

      // ✅ Calculate end time (default to +30 minutes)
      const localEndDate = new Date(localStartDate);
      localEndDate.setMinutes(localEndDate.getMinutes() + 30);

      return {
        ...airing,
        airing_start_date: localStartDate, // ✅ Converted to local time
        end_date: localEndDate, // ✅ End date in local time
      };
    })
    .filter((airing) =>
      majorStations.includes(airing.airing_station.toLowerCase())
    );

  const handleNavigate = (date: Date): void => {
    dispatch(getDayAgendaAirings(formatSelectedDate(date)));
    setAgendaDate(date);
    localStorage.setItem(AIRING_DAY, date.toDateString());
  };

  const handleCloseInfoModal = (): void => {
    setAiringToPreview(undefined);
    toggleAiringInfoModal(false);
  };

  const handleOpenInfoModal = (airing: AgendaAiring): void => {
    setAiringToPreview(airing);
    toggleAiringInfoModal(true);
  };

  useEffect(() => {
    dispatch(getDayAgendaAirings(formatSelectedDate(agendaDate)));
  }, []);

  return (
    <>
      <Calendar<AgendaAiring>
        localizer={localizer}
        startAccessor="airing_start_date"
        date={agendaDate}
        endAccessor="end_date"
        onNavigate={handleNavigate}
        events={airings}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(s): void => {
          handleOpenInfoModal(s);
        }}
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
        tooltipAccessor={(airing: AgendaAiring) =>
          airing.airing_item_description
        }
        views={['day']}
        style={{ height: 1000, padding: '0 3%' }}
      />
      {airingToPreview != null && (
        <AiringInfoModal
          handleClose={handleCloseInfoModal}
          isOpen={isAiringInfoModalOpen}
          airingToPreview={airingToPreview}
        />
      )}
    </>
  );
}

export default AgendaCalendar;

