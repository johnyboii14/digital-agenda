import { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { getDayAgendaAirings } from "../../actions/airings";
import { AgendaAiring } from "../../@types";

const localizer = momentLocalizer(moment);

interface MyAgendaDayHeaderProps {
  date: Date;
  label: string;
}

const MyAgendaDayHeader = ({ date, label }: MyAgendaDayHeaderProps) => {
  return (
    <div>
      <div>{label}</div>
      <div>{moment(date).format("dddd, MMMM D, YYYY")}</div>
    </div>
  );
};

interface EventProps {
  event: AgendaAiring;
}
const MyAgendaEvent = ({ event }: EventProps) => {
  return (
    <div>
      <div>{event.item_name}</div>
      <div>{event.show}</div>
    </div>
  );
};

function AgendaCalendar() {
  const dispatch = useAppDispatch();
  const agendaStatus = useAppSelector((state) => state.airings.agendaStatus);
  const formatSelectedDate = (date: Date): string =>
    date.toISOString().split("T")[0];
  const airings: Array<AgendaAiring> = useAppSelector(
    (state) => state.airings.agendaAirings
  ).map((airing) => {
    const endDate = new Date(airing.airing_time);
    const date = new Date(endDate);
    date.setMinutes(date.getMinutes() + 30);
    const newDateString = moment(date).toDate();
    const airingStartDate = moment(airing.airing_time).toDate();
    return {
      ...airing,
      end_date: newDateString,
      airing_start_date: airingStartDate,
    };
  });
  const handleNavigate = (date: Date): void => {
    dispatch(getDayAgendaAirings(formatSelectedDate(date)));
  };
  useEffect(() => {
    if (agendaStatus === "idle") {
      dispatch(getDayAgendaAirings(formatSelectedDate(new Date())));
    }
  }, [agendaStatus, dispatch]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="airing_start_date"
        endAccessor="end_date"
        titleAccessor="item_name"
        onNavigate={handleNavigate}
        events={airings}
        selectable
        components={{
          day: {
            header: MyAgendaDayHeader,
            event: MyAgendaEvent,
          },
        }}
        view="day"
        onView={() => null}
        views={["day"]}
        style={{ height: 1000 }}
      />
    </div>
  );
}

export default AgendaCalendar;
