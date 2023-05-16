import React, { useState } from "react";

import "./styles.scss";
import { useNavigate } from "react-router-dom";

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
        <section className="svg-placement"></section>
      </section>
    </div>
  );
};

export default ViewNav;
