// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { AnimatePresence } from 'framer-motion';

// import Button from '@mui/material/Button';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import FilterIcon from '@mui/icons-material/FilterList';
// import IconButton from '@mui/material/IconButton';
// import LogoutIcon from '@mui/icons-material/Logout';
// import TableViewIcon from '@mui/icons-material/TableView';

// import TableFilterMenu from '../TableFilterMenu';
// import Logo from '../../assets/images/RctvLogo.png';
// import { VIEW_OPTION } from '../../@types';
// import { clearSearchResults, searchAirings } from '../../actions/airings';
// import { RootState } from '../../store';
// import { format } from "date-fns";

// import './styles.scss';

// interface HeaderProps {
//   viewOption: VIEW_OPTION;
//   handleViewOptionClick: (opt: VIEW_OPTION) => void;
// }

// const INACTIVE_GREY = '#DBD6D5';
// const ACTIVE_ICON_COLOR = '#E5A996;';
// const signInStyles = { 
//   backgroundColor: '#83C5BE',
//   boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
//   borderRadius: '20px',
//   padding: '15px 10px',
// };

// const Header = ({ viewOption, handleViewOptionClick }: HeaderProps): JSX.Element => {
//   const [showMenu, toggleMenu] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const searchResults = useSelector((state: RootState) => state.airings.searchResults);
//   const searchStatus = useSelector((state: RootState) => state.airings.searchStatus);

//   const handleClick = (): void => {
//     navigate('/admin');
//   };

//   const handleAgendaIconClick = (): void => {
//     toggleMenu(false);
//     if (viewOption === VIEW_OPTION.AGENDA) return;
//     handleViewOptionClick(VIEW_OPTION.AGENDA);
//   };

//   const handleTableIconClick = (): void => {
//     if (viewOption === VIEW_OPTION.TABLE) return;
//     handleViewOptionClick(VIEW_OPTION.TABLE);
//   };

//   const handleFilterClick = (): void => {
//     toggleMenu(!showMenu);
//   };

//   const handleMenuCloseClick = (): void => {
//     toggleMenu(false);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       (dispatch as any)(searchAirings(searchQuery));
//     }
//   };

//   const handleClearSearch = () => {
//     dispatch(clearSearchResults());
//     setSearchQuery('');
//   };

//   return (
//     <nav className="home-header">
//       <section className="flex flex-row justify-between items-center mt-4">
//         <img src={Logo} className="logo" alt="Rare Collectibles logo" />
//         <h1 className="title__text">Digital Agenda</h1>
//         <Button sx={signInStyles} variant="contained" className="w-32" endIcon={<LogoutIcon />} onClick={handleClick}>
//           Sign In
//         </Button>
//       </section>

//       <section className="flex flex-col">
//         {/* <section className="flex justify-start mt-12">
//           {viewOption === VIEW_OPTION.TABLE && (
//             <Button sx={{ backgroundColor: '#cb6c4d' }} variant="contained" startIcon={<FilterIcon />} onClick={handleFilterClick}>
//               Filter Airings
//             </Button>
//           )}
//         </section> */}

//         <div className="search-container w-[75%] mx-auto relative">
//           <form className="relative w-full" onSubmit={handleSearchSubmit}>
//             <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
//               Search
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                 <svg className="w-4 h-4 text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
//                 </svg>
//               </div>
//               <input
//                 type="search"
//                 id="default-search"
//                 className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Search airings..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 required
//               />
//               <div className="absolute right-2 bottom-2 flex gap-2">
//                 <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2">
//                   Search
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleClearSearch}
//                   className="text-gray-500 hover:text-gray-700 font-medium text-sm px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//                 >
//                   Clear Results
//                 </button>
//               </div>
//             </div>
//           </form>

//           {searchStatus !== 'idle' && (
//             <div className="search-results w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-96 overflow-y-auto mt-4">
//               {searchStatus === 'pending' && <p className="text-gray-500 p-4">Loading...</p>}
//               {searchStatus === 'failed' && <p className="text-red-500 p-4">Error loading results.</p>}
//               {searchStatus === 'succeeded' && searchResults.length === 0 && (
//                 <p className="text-gray-500 p-4">No results found.</p>
//               )}
//               {searchStatus === 'succeeded' && searchResults.length > 0 && (
//                 <table className="w-full border-collapse">
//                   <thead className="bg-gray-200 sticky top-0 z-10">
//                     <tr>
//                       <th className="p-2 border">Airing Time</th>
//                       <th className="p-2 border">Item Number</th>
//                       <th className="p-2 border">Description</th>
//                       <th className="p-2 border">Airing ID</th>
//                       <th className="p-2 border">Show</th>
//                       <th className="p-2 border">Station</th>
//                       <th className="p-2 border">Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {searchResults.map((airing) => (
//                       <tr key={airing.airing_id} className="hover:bg-gray-100 cursor-pointer">
//                         <td className="p-2 border">{format(new Date(airing.airing_date_time), "M/d/yyyy h:mm a")}</td>
//                         <td className="p-2 border">{airing.airing_item_number}</td>
//                         <td className="p-2 border">{airing.airing_item_description}</td>
//                         <td className="p-2 border">{airing.airing_id}</td>
//                         <td className="p-2 border">{airing.airing_show}</td>
//                         <td className="p-2 border">{airing.airing_station}</td>
//                         <td className="p-2 border">${airing.airing_price}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           )}
//         </div>

//         <AnimatePresence>{showMenu && <TableFilterMenu handleClose={handleMenuCloseClick} />}</AnimatePresence>
//       </section>
//     </nav>
//   );
// };

// export default Header;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import TableViewIcon from '@mui/icons-material/TableView';

import TableFilterMenu from '../TableFilterMenu';
import Logo from '../../assets/images/RctvLogo.png';
import { VIEW_OPTION } from '../../@types';
import { clearSearchResults, searchAirings } from '../../actions/airings';
import { RootState } from '../../store';
import { format } from "date-fns";

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

const Header = ({ viewOption, handleViewOptionClick }: HeaderProps): JSX.Element => {
  const [showMenu, toggleMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchResults = useSelector((state: RootState) => state.airings.searchResults);
  const searchStatus = useSelector((state: RootState) => state.airings.searchStatus);

  const handleClick = (): void => {
    navigate('/admin');
  };

  const handleAgendaIconClick = (): void => {
    toggleMenu(false);
    if (viewOption === VIEW_OPTION.AGENDA) return;
    handleViewOptionClick(VIEW_OPTION.AGENDA);
  };

  const handleTableIconClick = (): void => {
    if (viewOption === VIEW_OPTION.TABLE) return;
    handleViewOptionClick(VIEW_OPTION.TABLE);
  };

  const handleFilterClick = (): void => {
    toggleMenu(!showMenu);
  };

  const handleMenuCloseClick = (): void => {
    toggleMenu(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      (dispatch as any)(searchAirings(searchQuery));
    }
  };

  const handleClearSearch = () => {
    dispatch(clearSearchResults());
    setSearchQuery('');
  };

  return (
    <nav className="home-header">
      <section className="flex flex-row justify-between items-center mt-4">
        <img src={Logo} className="logo" alt="Rare Collectibles logo" />
        <h1 className="title__text">Digital Agenda</h1>
        <Button sx={signInStyles} variant="contained" className="w-32" endIcon={<LogoutIcon />} onClick={handleClick}>
          Sign In
        </Button>
      </section>

      <section className="flex flex-col">
        {/* ✅ Restore View Toggle Section */}
        <section className="flex justify-center items-center flex-col mt-8">
          <header className="text-white text-3xl font-bold mb-4">View</header>
          <section className="flex flex-row gap-6">
            <IconButton
              data-cy="image-view-btn"
              sx={{ backgroundColor: viewOption === VIEW_OPTION.AGENDA ? ACTIVE_ICON_COLOR : INACTIVE_GREY }}
              onClick={handleAgendaIconClick}
            >
              <CalendarTodayIcon htmlColor="white" />
            </IconButton>
            <IconButton
              data-cy="table-view-btn"
              sx={{ backgroundColor: viewOption === VIEW_OPTION.TABLE ? ACTIVE_ICON_COLOR : INACTIVE_GREY }}
              onClick={handleTableIconClick}
            >
              <TableViewIcon htmlColor="white" />
            </IconButton>
          </section>
        </section>

        {/* ✅ SEARCH BAR */}
        <div className="search-container w-[75%] mx-auto relative mt-6">
          <form className="relative w-full" onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search airings..."
                value={searchQuery}
                onChange={handleSearchChange}
                required
              />
              <div className="absolute right-2 bottom-2 flex gap-2">
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2">
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </form>

          {searchStatus !== 'idle' && (
            <div className="search-results w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-96 overflow-y-auto mt-4">
              {searchStatus === 'pending' && <p className="text-gray-500 p-4">Loading...</p>}
              {searchStatus === 'failed' && <p className="text-red-500 p-4">Error loading results.</p>}
              {searchStatus === 'succeeded' && searchResults.length === 0 && (
                <p className="text-gray-500 p-4">No results found.</p>
              )}
              {searchStatus === 'succeeded' && searchResults.length > 0 && (
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-2 border">Airing Time</th>
                      <th className="p-2 border">Item Number</th>
                      <th className="p-2 border">Description</th>
                      <th className="p-2 border">Airing ID</th>
                      <th className="p-2 border">Show</th>
                      <th className="p-2 border">Station</th>
                      <th className="p-2 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((airing) => (
                      <tr key={airing.airing_id} className="hover:bg-gray-100 cursor-pointer">
                        <td className="p-2 border">{format(new Date(airing.airing_date_time), "M/d/yyyy h:mm a")}</td>
                        <td className="p-2 border">{airing.airing_item_number}</td>
                        <td className="p-2 border">{airing.airing_item_description}</td>
                        <td className="p-2 border">{airing.airing_id}</td>
                        <td className="p-2 border">{airing.airing_show}</td>
                        <td className="p-2 border">{airing.airing_station}</td>
                        <td className="p-2 border">${airing.airing_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>{showMenu && <TableFilterMenu handleClose={handleMenuCloseClick} />}</AnimatePresence>
      </section>
    </nav>
  );
};

export default Header;
