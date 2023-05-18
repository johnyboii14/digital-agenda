import React from "react";

import Composites from "./Composites";
import DownSells from "./DownSells";
import UpSells from "./UpSells";

function DropDownMenu() {
  return (
    <div>
      <Composites />
      <br />
      <DownSells />
      <br />
      <UpSells />
    </div>
  );
}

export default DropDownMenu;
