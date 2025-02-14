import { useEffect, useState } from 'react';
// import {  Calendar, momentLocalizer } from 'react-big-calendar';
// import { Calendar, CalendarProps } from 'react-big-calendar';
import Calendar from './CalendarWrapper';
import {  momentLocalizer } from 'react-big-calendar';



import moment from 'moment';
import 'moment-timezone'; // ✅ Ensures moment-timezone extends moment

import AgendaEvent from './AgendaEvent';
import AiringInfoModal from '../AiringInfoModal';

import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { getDayAgendaAirings } from '../../actions/airings';
import { type AgendaAiring } from '../../@types';
import { AIRING_DAY, DEFAULT_TIMEZONE } from '../../constants';

import { CalendarProps } from 'react-big-calendar';



const localizer = momentLocalizer(moment);

interface EventProps {
  event: AgendaAiring;
}



const MyAgendaEvent = ({ event }: EventProps): JSX.Element => {
  return <AgendaEvent key={event.ID} event={event} />;
};

function AgendaCalendar(): JSX.Element {
  const [isAiringInfoModalOpen, toggleAiringInfoModal] = useState<boolean>(false);
  const [airingToPreview, setAiringToPreview] = useState<AgendaAiring>();

  const rawAiringDay: string | null = localStorage.getItem(AIRING_DAY);
  let initialAiringDay: Date = new Date();
  if (rawAiringDay !== null) {
    initialAiringDay = new Date(rawAiringDay);
  }

  const [agendaDate, setAgendaDate] = useState<Date | string>(initialAiringDay);
  const dispatch = useAppDispatch();

  // Function to format the selected date (always use UTC for filtering)
  const formatSelectedDate = (date: Date | string): string => {
    return moment.utc(date).format('YYYY-MM-DD');
  };

  // Style logic for events
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

  // ✅ TEMP FIX: Convert UTC to Local and Filter Only Matching UTC Dates
  const selectedUTCDate = moment.utc(agendaDate).startOf('day');

  const airings: AgendaAiring[] = useAppSelector(
    (state) => state.airings.agendaAirings
  )
    .map((airing) => {
      // 🟢 Always interpret airing_date_time as UTC
      const airingUTC = moment.utc(airing.airing_date_time);
      const airingLocal = airingUTC.clone().tz(userTimeZone); // ✅ Fixed: tz() now works!
      const endLocal = airingLocal.clone().add(30, 'minutes');

      return {
        ...airing,
        airing_start_date: airingLocal.toDate(), // Display time converted to local
        end_date: endLocal.toDate(), // Display end time converted to local
        airing_utc_date: airingUTC.format('YYYY-MM-DD'), // Store UTC date for filtering
      };
    })
    .filter(
      (airing) => airing.airing_utc_date === selectedUTCDate.format('YYYY-MM-DD')
    ) // ✅ Only show airings for the selected UTC date
    .filter((airing) =>
      majorStations.includes(airing.airing_station.toLowerCase())
    );

  // Handle day navigation
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

  // useEffect(() => {
  //   dispatch(getDayAgendaAirings(formatSelectedDate(agendaDate)));
  // }, []);

  useEffect(() => {
  dispatch(getDayAgendaAirings(formatSelectedDate(agendaDate)));
}, [dispatch, agendaDate]); // ✅ Correct dependencies


const calendarProps = {
  ...({
    localizer,
    startAccessor: 'airing_start_date',
    date: agendaDate,
    endAccessor: 'end_date',
    onNavigate: handleNavigate,
    events: airings,
    eventPropGetter: eventStyleGetter,
    onSelectEvent: handleOpenInfoModal,
    selectable: true,
    components: {
      day: {
        event: MyAgendaEvent,
      },
    },
    view: 'day',
    timeslots: 1,
    step: 30,
    onView: () => null,
    tooltipAccessor: (airing: AgendaAiring) => airing.airing_item_description,
    views: ['day'],
    style: { height: 1000, padding: '0 3%' },
  } as unknown as CalendarProps<object, object>),
};



  return (
    // <>
    //   <Calendar
    //     localizer={localizer}
    //     startAccessor="airing_start_date"
    //     date={agendaDate}
    //     endAccessor="end_date"
    //     onNavigate={handleNavigate}
    //     events={airings}
    //     eventPropGetter={eventStyleGetter}
    //     onSelectEvent={(s: any): void => {
    //       handleOpenInfoModal(s);
    //     }}
    //     selectable
    //     components={{
    //       day: {
    //         event: MyAgendaEvent,
    //       },
    //     }}
    //     view="day"
    //     timeslots={1}
    //     step={30}
    //     onView={() => null}
    //     tooltipAccessor={(airing: AgendaAiring) =>
    //       airing.airing_item_description
    //     }
    //     views={['day']}
    //     style={{ height: 1000, padding: '0 3%' }}
    //   />
    //   {airingToPreview != null && (
    //     <AiringInfoModal
    //       handleClose={handleCloseInfoModal}
    //       isOpen={isAiringInfoModalOpen}
    //       airingToPreview={airingToPreview}
    //     />
    //   )}
    // </>
    <Calendar {...calendarProps} />
  );
}

export default AgendaCalendar;
