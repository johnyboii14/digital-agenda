import { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Tooltip from "@mui/material/Tooltip";
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
      <div className="agenda-label__text">{label}</div>
      <div>{moment(date).format("dddd, MMMM D, YYYY")}</div>
    </div>
  );
};

interface EventProps {
  event: AgendaAiring;
}
const MyAgendaEvent = ({ event }: EventProps) => {
  return (
    <Tooltip title={event.item_name}>
      <div>
        <div className="agenda-item-name__text">{event.item_name}</div>
        <div className="agenda-item-show__text">{event.show}</div>
      </div>
    </Tooltip>
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
        tooltipAccessor={(airing: AgendaAiring) => airing.item_name}
        views={["day"]}
        style={{ height: 1000, padding: "0 3%" }}
      />
    </div>
  );
}

export default AgendaCalendar;
