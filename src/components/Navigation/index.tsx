import React, { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.scss";

function Navigation() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <header className="nav-header">
      <button className="nav-hamburger" onClick={handleToggleSidebar}>
        <MenuIcon />
      </button>
      <nav className={`nav-sidebar ${showSidebar ? "open" : ""}`}>
        <button className="nav-close" onClick={handleCloseSidebar}>
          <CloseIcon />
        </button>
        <ul className="nav-links">
          <li>
            <a href="">Admin Login</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
