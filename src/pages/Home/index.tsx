import { useEffect, useState } from "react";

import ShoppingBlocks from "../../components/ShoppingBlocks";
import Header from "../../components/Header";
import InfomericalsTable from "../../components/Infomercials";

import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { clearEvents } from "../../actions/events";

import "./styles.scss";
import ViewNav from "../../components/ViewNav";

function Home() {
  const backgrounImage = "url(../../assets/images/Thursday-Social.jpg)";
  const backgrounStyle = {
    backgrounImage,
    backgroundSize: "cover",
    backgrounPosition: "fill",
    height: "100vg",
    backgroundBlendMode: "multiply",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    opacity: "90%",
  };

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
    <div style={backgrounStyle}>
      <header>
        <Header />
      </header>
      <header>
        <ViewNav isDataView={isDataView} onToggle={handleToggle} />
      </header>
      <main>
        {isDataView ? (
          <ShoppingBlocks events={events} />
        ) : (
          <InfomericalsTable events={events} />
        )}
      </main>
    </div>
  );
}

export default Home;
