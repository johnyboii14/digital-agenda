import { useNavigate } from "react-router-dom";
import TableRow from "@mui/material/TableRow";

import * as React from "react";

import { StyledTableCell } from ".";

import { EVENT } from "../../@types";

interface DataRowProps {
  event: EVENT;
}

function ShoppingBlocksDataRow({ event }: DataRowProps) {
  const navigate = useNavigate();
  if (!event) {
    return null;
  }
  const {
    id,
    event_description,
    item_no,
    station,
    airing_id,
    airtime: airTimeDate,
    price,
  } = event;
  const airTime = new Date(airTimeDate).toDateString();
  return (
    <TableRow
      key={id}
      sx={{
        border: "none",
        "&:nth-of-type(odd)": {
          backgroundColor: "white",
        },
      }}
    >
      <StyledTableCell> {event_description}</StyledTableCell>
      <StyledTableCell>{item_no}</StyledTableCell>
      <StyledTableCell>{station}</StyledTableCell>
      <StyledTableCell>{airTime}</StyledTableCell>
      <StyledTableCell>{airing_id}</StyledTableCell>
      <StyledTableCell>${price}</StyledTableCell>
    </TableRow>
  );
}

export default ShoppingBlocksDataRow;
