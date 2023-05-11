import React from "react";

import Logo from "../../assets/images/RctvLogo.png";

import "./styles.scss";
import SearchBar from "./SearchBar";
import ToggleSwitch from "./ToggleSwitch";
import AdminButton from "./AdminButton";

interface HeaderProps {
  isDataView: boolean;
  onToggle: () => void;
}

const Header = () => {
  return (
    <div className="home-header">
      <img src={Logo} alt="Rare Collectibles logo" />
      <h1>Digital Agenda</h1>
      <AdminButton />
      <SearchBar />
    </div>
  );
};

export default Header;
