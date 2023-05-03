import React, { ReactElement, useEffect, useState } from "react";
import Header from "../../components/Header";
import ShoppingBlocks from "../../components/ShoppingBlocks";

import "./styles.scss";
import Navigation from "../../components/Navigation";

import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { clearEvents } from "../../actions/events";
import InfomericalsTable from "../../components/Infomercials";

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
