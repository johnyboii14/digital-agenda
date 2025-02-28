import { useEffect, useState } from 'react';
import Calendar from './CalendarWrapper';
import {  momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
import 'moment-timezone'; 

import AgendaEvent from './AgendaEvent';

import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { getDayAgendaAirings } from '../../actions/airings';
import { type AgendaAiring } from '../../@types';
import { AIRING_DAY} from '../../constants';

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
    if (event.airing_station.toLowerCase().includes('cnbc')) {
      className += 'nbc-rbc-event';
    }
    return {
      className,
    };
  };

  const majorStations = [
    'bloomberg',
    'fox',
    'cnbc',
  ];

  

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // ✅ TEMP FIX: Convert UTC to Local and Filter Only Matching UTC Dates
  const selectedUTCDate = moment.utc(agendaDate).startOf('day');

  const airings: AgendaAiring[] = useAppSelector(
    (state) => state.airings.agendaAirings
  )
    .map((airing) => {
      const airingUTC = moment.utc(airing.airing_date_time)
      const airingLocal = airingUTC.clone().tz(userTimeZone)
      let endLocal = airingLocal.clone().add(30, 'minutes')

      if(endLocal.isAfter(airingLocal.clone().endOf('day'))){
        endLocal = airingLocal.clone().endOf('day')
      }

      return{
        ...airing,
        airing_start_date: airingLocal.isValid() ? airingLocal.toDate() : new Date(),
        end_date: endLocal.isValid() ? endLocal.toDate() : airingLocal.toDate(),
        airing_utc_date: airingUTC.format('YYY=MM-DD')
      }
    })
    .filter((airing) => {
      const airingLocal = moment.utc(airing.airing_date_time).tz(userTimeZone)

      const startOfDay = moment(agendaDate).tz(userTimeZone).startOf('day')
      const endOfDay = moment(agendaDate).tz(userTimeZone).endOf('day')

      return airingLocal.isBetween(startOfDay, endOfDay, null, '[]')
    })
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
    <Calendar {...calendarProps} />
  );
}

export default AgendaCalendar;
