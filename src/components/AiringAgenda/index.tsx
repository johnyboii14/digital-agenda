import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { useEffect } from "react";
import { getDayAgendaAirings } from "../../actions/airings";
import { AgendaAiring } from "../../@types";

const localizer = momentLocalizer(moment);

function AgendaCalendar() {
  const dispatch = useAppDispatch();
  const agendaStatus = useAppSelector((state) => state.airings.agendaStatus);
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
  useEffect(() => {
    if (agendaStatus === "idle") {
      dispatch(getDayAgendaAirings());
    }
  }, [agendaStatus, dispatch]);
  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="airing_start_date"
        endAccessor="end_date"
        titleAccessor="item_name"
        events={airings}
        view="day"
        onView={() => null}
        views={["day"]}
        style={{ height: 1000 }}
      />
    </div>
  );
}

export default AgendaCalendar;
