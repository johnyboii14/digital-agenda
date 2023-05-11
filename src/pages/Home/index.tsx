import { useEffect, useState } from "react";

import Header from "../../components/Header";
import ViewNav from "../../components/ViewNav";

import { useAppDispatch } from "../../config/hooks";
import { clearEvents } from "../../actions/events";

import "./styles.scss";

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

  return (
    <div style={backgrounStyle}>
      <header>
        <Header />
      </header>
      <header>
        <ViewNav isDataView={isDataView} onToggle={handleToggle} />
      </header>
      <main></main>
    </div>
  );
}

export default Home;
