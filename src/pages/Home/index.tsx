import {  useEffect, useState } from "react";

import ShoppingBlocks from "../../components/ShoppingBlocks";
import Header from "../../components/Header";
import InfomericalsTable from "../../components/Infomercials";
import Navigation from "../../components/Navigation";

import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { clearEvents } from "../../actions/events";

import "./styles.scss";

function Home() {
  const dispatch = useAppDispatch();
  const [isDataView, setIsDataView] = useState(false);
  useEffect(() => {
    dispatch(clearEvents());
  }, [dispatch]);

  const handleToggle = () => {
    setIsDataView(!isDataView);
  };

  const events = useAppSelector((state) => state.events.events);

  return (
    <div>
      <header className="header-placement">
        <Navigation />
        <Header isDataView={isDataView} onToggle={handleToggle} />
      </header>
      <article>
        {isDataView ? (
          <ShoppingBlocks events={events} />
        ) : (
          <InfomericalsTable events={events} />
        )}
      </article>
    </div>
  );
}

export default Home;
