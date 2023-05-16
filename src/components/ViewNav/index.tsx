import React, { useState } from "react";

import "./styles.scss";
import { useNavigate } from "react-router-dom";
import ViewButton from "./ViewButton";

const ViewNav = () => {
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
      <section className="column">
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
      </section>
    </div>
  );
};

export default ViewNav;
