import React from "react";

import Logo from "../../assets/images/RctvLogo.png";

import SearchBar from "./SearchBar";

import "./styles.scss";

interface HeaderProps {
  isDataView: boolean;
  onToggle: () => void;
}

const Header = ({ isDataView, onToggle }: HeaderProps) => {
  return (
    <header className="home-header">
      <img src={Logo} alt="Rare Collectibles logo" />
      <SearchBar />
      <h1>Digital Agenda</h1>
    </header>
  );
};

export default Header;
