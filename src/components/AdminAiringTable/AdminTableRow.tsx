import TableRow from "@mui/material/TableRow";

import { StyledTableCell } from ".";

import { Airing } from "../../@types";

interface AdminTableRowProps {
  data: Airing;
}

function AdminTableRow({ data }: AdminTableRowProps): JSX.Element {
  const {
    item_name: itemName,
    item_number: itemNum,
    station,
    airing_time: airingTime,
    price,
    airing_id: airingId,
    show,
  } = data;
  const localePrice = price.toLocaleString();
  return (
    <TableRow
      sx={{
        border: "none",
        "&:nth-of-type(odd)": {
          backgroundColor: "#F9E9E3",
        },
      }}
    >
      <StyledTableCell>{itemName}</StyledTableCell>
      <StyledTableCell>{itemNum}</StyledTableCell>
      <StyledTableCell>{airingId}</StyledTableCell>
      <StyledTableCell>{new Date(airingTime).toDateString()}</StyledTableCell>
      <StyledTableCell>{show}</StyledTableCell>
      <StyledTableCell>{station}</StyledTableCell>
      <StyledTableCell>${localePrice}</StyledTableCell>
    </TableRow>
  );
}

export default AdminTableRow;
