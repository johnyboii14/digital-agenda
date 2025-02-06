import { useEffect, useRef, useState } from 'react';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import AiringTableRow from './AiringTableRow';
import AdminTableRow from './AdminTableRow';

import { useAppDispatch, useAppSelector } from '../../config/hooks';

import { getTableAirings, getTotalAirings } from '../../actions/airings';

import { type Airing } from '../../@types';
import {
  DIGITAL_AGENDA_TABLE_HEADERS,
  AIRING_TABLE_AIRING_ID_FILTER,
  AIRING_TABLE_ITEM_NAME_FILTER,
  AIRING_TABLE_ITEM_NUMBER_FILTER,
  AIRING_TABLE_PRICE_FILTER,
  AIRING_TABLE_SHOW_FILTER,
  AIRING_TABLE_STATION_FILTER,
  AIRING_TABLE_PRICE_OVER_UNDER_FILTER,
  AIRING_TABLE_DATE_KEY,
  AIRING_TABLE_SORT_KEY,
  AIRING_TABLE_SORT_DIR_KEY,
} from '../../constants';
import formatDate from '../../modules/formatDate';
import addSubtractDay from '../../modules/addSubtractDay';
import replaceDateInQueryString from '../../modules/replaceDateInQueryString';
import formatRowHeaders from '../../modules/formatRowHeaders';
import updateTableURL from '../../modules/updateTableURL';
import ScrollToTop from '../ScrollToTop';

const fontFamily = 'Neue Haas Grotesk';

const StyledTableCellHeader = styled(TableCell)(() => ({
  backgroundColor: '#F5F5F5',
  fontFamily,
  fontWeight: '600',
  textAlign: 'center',
}));

export const StyledTableCell = styled(TableCell)(() => ({
  border: 'none',
  fontWeight: '500',
  textAlign: 'center',
  fontFamily,
}));

interface AiringTableProps {
  isAdmin: boolean;
  handleDeleteClick?: (airing: Airing) => void;
  handleEditClick?: (airing: Airing) => void;
}

function AiringTable({
  isAdmin = false,
  handleDeleteClick,
  handleEditClick,
}: AiringTableProps): JSX.Element {
  
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const airings = useAppSelector((state) => state.airings.tableAirings);
  const airingsStatus = useAppSelector((state) => state.airings.status);
  const priceFilter = localStorage.getItem(AIRING_TABLE_PRICE_FILTER);
  const stationFilter = localStorage.getItem(AIRING_TABLE_STATION_FILTER);
  const showFilter = localStorage.getItem(AIRING_TABLE_SHOW_FILTER);
  const initialDate = localStorage.getItem(AIRING_TABLE_DATE_KEY);
  const initialSortKey = localStorage.getItem(AIRING_TABLE_SORT_KEY);
  const initialIsDesc = localStorage.getItem(AIRING_TABLE_SORT_DIR_KEY);

  const itemNumberFilter = localStorage.getItem(
    AIRING_TABLE_ITEM_NUMBER_FILTER
  );
  const priceOverUnderFilter = localStorage.getItem(
    AIRING_TABLE_PRICE_OVER_UNDER_FILTER
  );
  const airingIdFilter = localStorage.getItem(AIRING_TABLE_AIRING_ID_FILTER);
  const itemNameFilter = localStorage.getItem(AIRING_TABLE_ITEM_NAME_FILTER);
  const [sortKey, setSortKey] = useState<string>(
  initialSortKey !== null ? initialSortKey : 'airing_date_time'
  );
  const [isDesc, setDesc] = useState<boolean>(
    initialIsDesc !== null ? Boolean(initialIsDesc) : false
  );
  const [currentDate, setCurrentDate] = useState<string>(
    initialDate !== null ? initialDate : formatDate(new Date())
  );
  interface RawFilter {
    key: string;
    value: string | null;
    storageKey: string;
    label: string;
  }
  const rawFiltersToShow: RawFilter[] = [
    {
      label: 'Price',
      key: 'price',
      value: priceFilter,
      storageKey: AIRING_TABLE_PRICE_FILTER,
    },
    {
      label: 'Station',
      value: stationFilter,
      storageKey: AIRING_TABLE_STATION_FILTER,
      key: 'station',
    },
    {
      label: 'Show',
      value: showFilter,
      storageKey: AIRING_TABLE_SHOW_FILTER,
      key: 'show',
    },
    {
      label: 'Item Number',
      value: itemNumberFilter,
      storageKey: AIRING_TABLE_ITEM_NUMBER_FILTER,
      key: 'item_number',
    },
    {
      label: 'Over Under',
      value: priceOverUnderFilter,
      storageKey: AIRING_TABLE_PRICE_OVER_UNDER_FILTER,
      key: 'under',
    },
    {
      label: 'Airing ID',
      value: airingIdFilter,
      storageKey: AIRING_TABLE_AIRING_ID_FILTER,
      key: 'airing_id',
    },
    {
      label: 'Item Name',
      value: itemNameFilter,
      storageKey: AIRING_TABLE_ITEM_NAME_FILTER,
      key: 'item_name',
    },
  ];
  let queryUrl: string = `?day=${currentDate}&sort_by=${sortKey}&sort_order=${
    isDesc ? 'desc' : 'asc'
  }`;
  rawFiltersToShow.forEach((f) => {
    let val = f.value;
    if (val !== undefined && val !== null) {
      if (f.key === 'under') {
        if (val === 'over') {
          val = 'false';
        } else {
          val = 'true';
        }
      }
      queryUrl += `&${f.key}=${val}`;
    }
  });
  const handleFilterClose = (key: string): void => {
    if (key === 'price') {
      const priceIdx = rawFiltersToShow.findIndex((f) => f.key === 'price');
      const overUnderIdx = rawFiltersToShow.findIndex(
        (f) => f.key === 'Over Under'
      );
      rawFiltersToShow[priceIdx].value = null;
      rawFiltersToShow[overUnderIdx].value = null;
    } else {
      localStorage.removeItem(key);
      const idx = rawFiltersToShow.findIndex((f) => f.storageKey === key);
      if (idx > -1) {
        rawFiltersToShow[idx].value = null;
      }
    }
    dispatch(getTableAirings(queryUrl));
  };
  const filtersToShow: JSX.Element[] = rawFiltersToShow.map((rawFilter) => {
    if (rawFilter.key === 'under') {
      return <></>;
    }
    if (rawFilter.value === null) {
      return <></>;
    }
    let valueText = rawFilter.value;
    if (rawFilter.key === 'price') {
      const rawPriceOverUnder = localStorage.getItem(
        AIRING_TABLE_PRICE_OVER_UNDER_FILTER
      );
      const overUnderText =
        rawPriceOverUnder !== null ? rawPriceOverUnder : 'Under';
      valueText = `${
        overUnderText.charAt(0).toUpperCase() + overUnderText.slice(1)
      } $${valueText}`;
    }
    const handleClose = (): void => {
      handleFilterClose(rawFilter.storageKey);
    };
    return (
      <article className="airing-filter__container" key={rawFilter.key}>
        <IconButton onClick={handleClose}>
          <CloseIcon htmlColor="white" />
        </IconButton>
        <header>
          {rawFilter.key.replace(
            /^_*(.)|_+(.)/g,
            (_s, c: string | undefined, d: string) =>
              c !== undefined && c.length > 0
                ? c.toUpperCase()
                : ' ' + d.toUpperCase()
          )}
        </header>
        <h6>{valueText}</h6>
      </article>
    );
  });

  const headerClickHandler = (key: string): void => {
    const isCurrentKey = key === sortKey;
    if (isCurrentKey) {
      setDesc(!isDesc);
      queryUrl = updateTableURL(queryUrl, '', key, !isDesc ? 'desc' : 'asc');
      dispatch(getTableAirings(queryUrl));
      return;
    }

    localStorage.setItem(AIRING_TABLE_SORT_DIR_KEY, JSON.stringify(false));
    localStorage.setItem(AIRING_TABLE_SORT_KEY, key);
    setDesc(false);
    setSortKey(key);
    queryUrl = updateTableURL(queryUrl, '', key, 'asc');
    dispatch(getTableAirings(queryUrl));
  };

  useEffect(() => {
    dispatch(getTableAirings(queryUrl));
    dispatch(getTotalAirings());
  }, [dispatch]);

  const columns = (): JSX.Element[] =>
    DIGITAL_AGENDA_TABLE_HEADERS.map((key): JSX.Element => {
      const handleClick = (): void => {
        headerClickHandler(key);
      };
      const className =
        key === sortKey ? 'table-header__text--selected' : 'table-header__text';
      return (
        <td
          className={className}
          key={key}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          {formatRowHeaders(key)}
        </td>
      );
    });

  const handleChangePage = (goBack: boolean): void => {
    if (airingsStatus === 'pending') {
      return;
    }
    let newDate = '';
    if (goBack) {
      newDate = addSubtractDay(currentDate, 0);
    } else {
      newDate = addSubtractDay(currentDate, 2);
    }
    setCurrentDate(newDate);
    queryUrl = replaceDateInQueryString(queryUrl, newDate);
    dispatch(getTableAirings(queryUrl));
  };

  const handleGoBackClick = (): void => {
    handleChangePage(true);
  };
  const handleGoForwardClick = (): void => {
    handleChangePage(false);
  };

  const rows =
    airings !== undefined && airings !== null && airings.length > 0
      ? airings.map((airing: Airing) =>
          isAdmin &&
          handleEditClick !== undefined &&
          handleDeleteClick !== undefined ? (
            <AdminTableRow
              key={airing.ID}
              data={airing}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
          ) : (
            <AiringTableRow key={airing.ID} data={airing} />
          )
        )
      : [];
  return (
    <section className="admin-data__container">
      <section className="airing-filters__container">{filtersToShow}</section>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 750 }}>
          <table className="airing-table__container" aria-label="sticky table">
            <thead>
              <tr style={{ backgroundColor: '#F5f5f5' }}>
                {columns()}
                {isAdmin && <StyledTableCellHeader />}
              </tr>
            </thead>
            <TableBody sx={{ border: 'none' }}>{rows}</TableBody>
          </table>
        </TableContainer>
        <div className="airing-table__pagination">
          <h6>
            page:
          </h6>
          <section>
            <IconButton onClick={handleGoBackClick}>
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton onClick={handleGoForwardClick}>
              <ArrowForwardIosIcon />
            </IconButton>
          </section>
        </div>
      </Paper>
      <ScrollToTop containerRef={tableContainerRef} />
    </section>
  );
}

export default AiringTable;
