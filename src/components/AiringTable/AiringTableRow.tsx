import TableRow from '@mui/material/TableRow';

import { StyledTableCell } from '.';

import { type Airing } from '../../@types';

interface AiringTableRowProps {
  data: Airing;
}

function AiringTableRow({ data }: AiringTableRowProps): JSX.Element {
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
  const airingDay = new Date(airingTime).toLocaleDateString();
  const airingFormattedTime = new Date(airingTime).toLocaleTimeString();
  return (
    <TableRow
      sx={{
        border: 'none',
        '&:nth-of-type(odd)': {
          backgroundColor: '#F9E9E3',
        },
      }}
    >
      <StyledTableCell>
        {airingDay} {airingFormattedTime}
      </StyledTableCell>
      <StyledTableCell>{itemNum}</StyledTableCell>
      <StyledTableCell sx={{ width: 15 }}>{itemName}</StyledTableCell>
      <StyledTableCell>{airingId}</StyledTableCell>
      <StyledTableCell>{show}</StyledTableCell>
      <StyledTableCell>{station}</StyledTableCell>
      <StyledTableCell>${localePrice}</StyledTableCell>
    </TableRow>
  );
}

export default AiringTableRow;
