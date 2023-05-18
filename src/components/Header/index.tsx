import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import CollectionsIcon from '@mui/icons-material/Collections';
import TableViewIcon from '@mui/icons-material/TableView';
import LoginIcon from '@mui/icons-material/Login';

import SearchBar from './SearchBar';

import Logo from '../../assets/images/RctvLogo.png';

import './styles.scss';

const Header = (): JSX.Element => {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/admin');
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
            <IconButton data-cy="image-view-btn">
              <CollectionsIcon htmlColor="white" />
            </IconButton>
          </article>
          <article>
            <IconButton
              data-cy="table-view-btn"
              sx={{ backgroundColor: 'blue' }}
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
