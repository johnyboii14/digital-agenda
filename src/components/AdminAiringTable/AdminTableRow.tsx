import { useState } from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';

import { StyledTableCell } from '.';

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
      <StyledTableCell sx={{ width: 15 }}>{itemName}</StyledTableCell>
      <StyledTableCell>{itemNum}</StyledTableCell>
      <StyledTableCell>{airingId}</StyledTableCell>
      <StyledTableCell>
        {airingDay} {airingFormattedTime}
      </StyledTableCell>
      <StyledTableCell>{show}</StyledTableCell>
      <StyledTableCell>{station}</StyledTableCell>
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
