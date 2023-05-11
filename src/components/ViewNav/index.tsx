import React, { useState } from "react";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TableViewIcon from "@mui/icons-material/TableView";

import "./styles.scss";
import ToggleSwitch from "../Header/ToggleSwitch";
import { useNavigate } from "react-router-dom";
import { Button, useScrollTrigger } from "@mui/material";
import ViewButton from "./ViewButton";

interface HeaderProps {
  isDataView: boolean;
  onToggle: () => void;
}

const ViewNav = ({ isDataView, onToggle }: HeaderProps) => {
  const [activeButton, setActiveButton] = useState<number>(1);
  const navigate = useNavigate();

  const handleButtonClick = (id: number) => {
    setActiveButton(id);
  };

  const handleClick = () => {
    navigate(`/admin`);
  };
  return (
    <div className="nav-placement">
      <h5>View</h5>
      <section className="svg-placement">
        <ViewButton
          id={1}
          onClick={handleButtonClick}
          active={activeButton === 1}
          className={activeButton === 1 ? "active" : "inactive"}
          text="monthly"
        />
        <ViewButton
          id={2}
          onClick={handleButtonClick}
          active={activeButton === 2}
          className={activeButton === 2 ? "active" : "inactive"}
          text="daily"
        />
      </section>
      <ToggleSwitch isChecked={isDataView} onChange={onToggle} />
    </div>
  );
};

export default ViewNav;

{
  /* <div className="nav-placement">
      <h5>View</h5>
      <section className="svg-placement">
        <section className="view-btn">
          <CalendarTodayIcon htmlColor="white" onClick={handleClick} />
        </section>
        <section className="view-btn-2">
          <TableViewIcon htmlColor="white" onClick={handleClick} />
        </section>
      </section>
      <ToggleSwitch isChecked={isDataView} onChange={onToggle} />
    </div> */
}
