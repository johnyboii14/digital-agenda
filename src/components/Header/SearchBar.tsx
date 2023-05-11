import React from "react";

import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
  return (
    <div className="container">
      <input type="text" placeholder="Search..." />
      <div className="search"></div>
    </div>
  );
}

export default SearchBar;
