import { useEffect, useState } from "react";

import AgendaCalendar from "../../components/AiringAgenda";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";

import { useAppDispatch } from "../../config/hooks";
import { clearEvents } from "../../actions/events";
import { clearAirings } from "../../actions/airings";

import "./styles.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";

function Home() {
  const dispatch = useAppDispatch();
  const [isDataView, setIsDataView] = useState(false);
  useEffect(() => {
    dispatch(clearEvents());
    dispatch(clearAirings());
  }, [dispatch]);

  const handleToggle = () => {
    setIsDataView(!isDataView);
  };

  return (
    <div className="main-bg">
      <header className="header-placement">
        <Navigation />
        <Header isDataView={isDataView} onToggle={handleToggle} />
      </header>
      <main>
        <AgendaCalendar />
      </main>
    </div>
  );
}

export default Home;
