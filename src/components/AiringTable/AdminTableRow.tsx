import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';

import { StyledTableCell } from './';
import { type Airing } from '../../@types';

interface AdminTableRowProps {
  data: Airing;
  handleDeleteClick: (airing: Airing) => void;
  handleEditClick: (airing: Airing) => void;
}

function AdminTableRow({
  data,
  handleDeleteClick,
  handleEditClick,
}: AdminTableRowProps): JSX.Element {
  const [anchorEl, setMenuEl] = useState<undefined | HTMLElement>(undefined);
  const open = Boolean(anchorEl);
  const handleClose = (): void => {
    setMenuEl(undefined);
  };

  const handleDeleteBtnClick = (): void => {
    handleDeleteClick(data);
  };

  const handleEditBtnClick = (): void => {
    handleEditClick(data);
  };

  const handleAdminAiringMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setMenuEl(event.currentTarget);
  };

  const {
    airing_item_description: itemName,
    airing_item_number: itemNum,
    airing_station: airingStation,
    airing_date_time: airingTime,
    airing_price: airingPrice,
    airing_id: airingId,
    airing_show: airingShow,
  } = data;

  // ✅ Ensure airingPrice is defined and is a number before calling toLocaleString
  const localePrice = airingPrice !== undefined && !isNaN(airingPrice)
    ? airingPrice.toLocaleString()
    : '0.00'; // Fallback value if undefined

  const airingDate = new Date(airingTime + 'Z'); // ✅ Ensure UTC interpretation

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const airingDay = airingDate.toLocaleDateString('en-US', {
    timeZone: userTimeZone, // ✅ Auto-detect user's timezone
  });

  const airingFormattedTime = airingDate.toLocaleTimeString('en-US', {
    timeZone: userTimeZone, // ✅ Auto-detect user's timezone
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

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
      <StyledTableCell>{airingShow}</StyledTableCell>
      <StyledTableCell>{airingStation}</StyledTableCell>
      <StyledTableCell>${localePrice}</StyledTableCell>
      <StyledTableCell sx={{ width: 3 }}>
        <Button
          onClick={handleAdminAiringMenuClick}
          sx={{ color: 'grey' }}
          variant="text"
        >
          ...
        </Button>
      </StyledTableCell>
      <Menu
        id={`${data.ID}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': `${data.ID}-button` }}
      >
        <MenuItem onClick={handleEditBtnClick}>Manage Airing</MenuItem>
        <MenuItem onClick={handleDeleteBtnClick}>Delete Airing</MenuItem>
      </Menu>
    </TableRow>
  );
}

export default AdminTableRow;
