import React from "react";

import Logo from "../../assets/images/RctvLogo.png";

import "./styles.scss";
import SearchBar from "./SearchBar";
import ToggleSwitch from "./ToggleSwitch";

interface HeaderProps {
  isDataView: boolean;
  onToggle: () => void;
}

const Header = ({ isDataView, onToggle }: HeaderProps) => {
  return (
    <div className="home-header">
      <section className="logo-toggle">
        <img src={Logo} alt="Rare Collectibles logo" />
        <ToggleSwitch isChecked={isDataView} onChange={onToggle} />
      </section>
      <section className="header-title">
        <h1>Digital Agenda</h1>
      </section>
      <section className="header-searchbar">
        <SearchBar />
      </section>
    </div>
  );
};

export default Header;
