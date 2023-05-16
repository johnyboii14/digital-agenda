import React from "react";

import Logo from "../../assets/images/RctvLogo.png";

import SearchBar from "./SearchBar";
import AdminButton from "./AdminButton";

import "./styles.scss";

interface HeaderProps {
  isDataView: boolean;
  onToggle: () => void;
}

const Header = () => {
  return (
    <header className="home-header">
      <img src={Logo} alt="Rare Collectibles logo" />
      <SearchBar />
      <h1>Digital Agenda</h1>
      <AdminButton />
    </header>
  );
};

export default Header;
