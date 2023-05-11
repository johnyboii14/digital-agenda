import React from "react";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TableViewIcon from "@mui/icons-material/TableView";
import { IconType } from "react-icons";

interface ButtonProps {
  id: number;
  onClick: (id: number) => void;
  active: boolean;
  className?: string;
  text: string;
}

const ViewButton = ({ id, onClick, active, className, text }: ButtonProps) => {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <button className={className} onClick={handleClick}>
      {text}
    </button>
  );
};

export default ViewButton;
