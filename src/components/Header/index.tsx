import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterIcon from '@mui/icons-material/Filter';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import TableViewIcon from '@mui/icons-material/TableView';

import TableFilterMenu from '../TableFilterMenu';

import Logo from '../../assets/images/RctvLogo.png';

import { VIEW_OPTION } from '../../@types';

import './styles.scss';

interface HeaderProps {
  viewOption: VIEW_OPTION;
  handleViewOptionClick: (opt: VIEW_OPTION) => void;
}
const INACTIVE_GREY = '#DBD6D5';
const ACTIVE_ICON_COLOR = '#E5A996;';
const signInStyles = {
  backgroundColor: '#83C5BE',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '20px',
  padding: '15px 10px',
};

const Header = ({
  viewOption,
  handleViewOptionClick,
}: HeaderProps): JSX.Element => {
  const [showMenu, toggleMenu] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/admin');
  };
  const handleAgendaIconClick = (): void => {
    toggleMenu(false);
    if (viewOption === VIEW_OPTION.AGENDA) {
      return;
    }
    handleViewOptionClick(VIEW_OPTION.AGENDA);
  };
  const handleTableIconClick = (): void => {
    if (viewOption === VIEW_OPTION.TABLE) {
      return;
    }
    handleViewOptionClick(VIEW_OPTION.TABLE);
  };
  const isAgendaActive = viewOption === VIEW_OPTION.AGENDA;
  const isTableActive = viewOption === VIEW_OPTION.TABLE;
  const agendaIconColor = isAgendaActive ? ACTIVE_ICON_COLOR : INACTIVE_GREY;
  const tableIconColor = isTableActive ? ACTIVE_ICON_COLOR : INACTIVE_GREY;
  const handleFilterClick = (): void => {
    toggleMenu(!showMenu);
  };
  const handleMenuCloseClick = (): void => {
    toggleMenu(false);
  };
  return (
    <nav className="home-header">
      <section className="nav-top-row__container">
        <img src={Logo} className="logo" alt="Rare Collectibles logo" />
        <h1 className="title__text">Digital Agenda</h1>
        <Button
          sx={signInStyles}
          variant="contained"
          endIcon={<LogoutIcon />}
          onClick={handleClick}
        >
          Sign In
        </Button>
      </section>
      <section>
        <section className="filter-airing__container">
          {viewOption === VIEW_OPTION.TABLE && (
            <Button
              sx={{ backgroundColor: '#cb6c4d' }}
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
            >
              Filter Airings
            </Button>
          )}
        </section>
        <section className="view-option__container">
          <header className="table-option__header">View</header>
          <section className="view-icon__container">
            <IconButton
              data-cy="image-view-btn"
              sx={{ backgroundColor: agendaIconColor }}
              onClick={handleAgendaIconClick}
            >
              <CalendarTodayIcon htmlColor="white" />
            </IconButton>
            <IconButton
              sx={{ backgroundColor: tableIconColor }}
              onClick={handleTableIconClick}
              data-cy="table-view-btn"
            >
              <TableViewIcon htmlColor="white" />
            </IconButton>
          </section>
        </section>
      </section>
      <AnimatePresence>
        {showMenu && <TableFilterMenu handleClose={handleMenuCloseClick} />}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
