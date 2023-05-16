import { useEffect, useState } from "react";

import Header from "../../components/Header";

import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { clearEvents } from "../../actions/events";

import ViewNav from "../../components/ViewNav";

import "./styles.scss";
import AiringsTable from "../../components/AiringsTable.tsx";

function Home() {
  const backgroundImage = "url(../../assets/images/Thursday-Social.jpg)";
  const backgroundStyle = {
    backgroundImage,
    backgroundSize: "cover",
    backgrounPosition: "fill",
    height: "100vg",
    backgroundBlendMode: "multiply",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    opacity: "90%",
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearEvents());
  }, [dispatch]);

  const events = useAppSelector((state) => state.events.events);

  return (
    <div style={backgroundStyle}>
      <Header />
      <ViewNav />
      <main>
        <AiringsTable events={events} />
      </main>
    </div>
  );
}

export default Home;
