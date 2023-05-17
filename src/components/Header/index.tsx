import React from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/images/RctvLogo.png";
import LoginIcon from "@mui/icons-material/Login";

import SearchBar from "./SearchBar";

import IconButton from "@mui/material/IconButton";
import CollectionsIcon from "@mui/icons-material/Collections";
import TableViewIcon from "@mui/icons-material/TableView";

import "./styles.scss";

const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/admin`);
  };
  return (
    <header className="home-header">
      <img src={Logo} alt="Rare Collectibles logo" />
      <SearchBar />
      <h1>Digital Agenda</h1>
      <div className="button-design" onClick={handleClick}>
        <article className="content-position">
          <LoginIcon htmlColor="white" />
          <h6>SIGN IN</h6>
        </article>
      </div>
      <article className="sort-option">
        <header className="table-option__header">View</header>
        <section>
          <article>
            <IconButton
              data-cy="image-view-btn"
              // sx={{ color: getIconColor(GALLERY_VIEW_OPTION) }}
              // onClick={() => toggleViewOption(GALLERY_VIEW_OPTION)}
            >
              <CollectionsIcon htmlColor="white" />
            </IconButton>
          </article>
          <article>
            <IconButton
              data-cy="table-view-btn"
              sx={{ backgroundColor: "blue" }}
              // sx={{ color: getIconColor(TABLE_VIEW_OPTION) }}
              // onClick={() => toggleViewOption(TABLE_VIEW_OPTION)}
            >
              <TableViewIcon htmlColor="white" />
            </IconButton>
          </article>
        </section>
      </article>
    </header>
  );
};

export default Header;
