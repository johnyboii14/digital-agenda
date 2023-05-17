import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { clearEvents } from "../../actions/events";

import Header from "../../components/Header";
import AiringsTable from "../../components/AiringsTable.tsx";

import "./styles.scss";

function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearEvents());
  }, [dispatch]);

  const events = useAppSelector((state) => state.events.events);

  return (
    <div className="main-page-style">
      <Header />
      <main>
        <AiringsTable events={events} />
      </main>
    </div>
  );
}

export default Home;
