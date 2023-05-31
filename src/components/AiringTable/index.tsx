import { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

import CloseIcon from '@mui/icons-material/Close';

import AiringTableRow from './AiringTableRow';

import { useAppDispatch, useAppSelector } from '../../config/hooks';

import { filterTableAirings, getTableAirings } from '../../actions/airings';

import { type Airing, type HeaderHash, type SortKey } from '../../@types';
import {
  AIRING_TABLE_NEXT_CURSOR_KEY,
  AIRING_TABLE_PAGE_KEY,
  AIRING_TABLE_PREVIOUS_TABLE_CURSOR_KEY,
  AIRING_TABLE_ROWS_PER_PAGE_KEY,
  AIRING_TABLE_CURSOR_KEY,
  DEFAULT_PER_PAGE,
  DEFAULT_CURSOR,
  DEFAULT_PREVIOUS_CURSOR,
  DEFAULT_ROW_OPTS,
  DIGITAL_AGENDA_TABLE_HEADERS,
  AIRING_TABLE_AIRING_ID_FILTER,
  AIRING_TABLE_ITEM_NAME_FILTER,
  AIRING_TABLE_ITEM_NUMBER_FILTER,
  AIRING_TABLE_PRICE_FILTER,
  AIRING_TABLE_SHOW_FILTER,
  AIRING_TABLE_STATION_FILTER,
  AIRING_TABLE_PRICE_OVER_UNDER_FILTER,
} from '../../constants';
import formatRowHeaders from '../../modules/formatRowHeaders';

const StyledTableCellHeader = styled(TableCell)(() => ({
  backgroundColor: '#F5F5F5',
  fontFamily: 'Neue Haas Grotesk Text Pro',
  fontWeight: '600',
  textAlign: 'center',
}));

const headerTypeHashmap: HeaderHash = {
  airing_time: 'date',
  item_number: 'string',
  item_name: 'string',
  airing_id: 'string',
  show: 'string',
  price: 'numeric',
  station: 'string',
};

const columns = (
  sortKey: string,
  isDesc: boolean,
  onClick: (key: string) => void
): JSX.Element[] =>
  DIGITAL_AGENDA_TABLE_HEADERS.filter(
    (k) => k !== 'highlights' && k !== 'attributes' && k !== 'images'
  ).map(
    (key): JSX.Element => (
      <StyledTableCellHeader
        align="right"
        padding="normal"
        key={key}
        sx={{ color: 'darkgrey', width: 60, textAlign: 'center' }}
      >
        <TableSortLabel
          active={sortKey === key}
          direction={isDesc ? 'desc' : 'asc'}
          onClick={() => {
            onClick(key);
          }}
        >
          {formatRowHeaders(key)}
          {sortKey === key && (
            <Box component="span" sx={visuallyHidden}>
              {isDesc ? 'sorted descending' : 'sorted ascending'}
            </Box>
          )}
        </TableSortLabel>
      </StyledTableCellHeader>
    )
  );

export const StyledTableCell = styled(TableCell)(() => ({
  border: 'none',
  fontWeight: '500',
  textAlign: 'center',
  fontFamily: 'Neue Haas Grotesk Text Pro',
}));

function AiringTable(): JSX.Element {
  const dispatch = useAppDispatch();
  const airings = useAppSelector((state) => state.airings.tableAirings);
  const airingsStatus = useAppSelector((state) => state.airings.status);
  let cursor = localStorage.getItem(AIRING_TABLE_CURSOR_KEY);
  if (cursor === '' || cursor === undefined || cursor === null) {
    cursor = '1';
  }

  const airingTotal = useAppSelector((state) => state.airings.airingTotal);
  let nextCursor = localStorage.getItem(AIRING_TABLE_NEXT_CURSOR_KEY);
  if (nextCursor === '' || nextCursor === undefined || nextCursor === null) {
    nextCursor = DEFAULT_CURSOR;
  }
  const priceFilter = localStorage.getItem(AIRING_TABLE_PRICE_FILTER);
  const stationFilter = localStorage.getItem(AIRING_TABLE_STATION_FILTER);
  const showFilter = localStorage.getItem(AIRING_TABLE_SHOW_FILTER);
  const itemNumberFilter = localStorage.getItem(
    AIRING_TABLE_ITEM_NUMBER_FILTER
  );
  const priceOverUnderFilter = localStorage.getItem(
    AIRING_TABLE_PRICE_OVER_UNDER_FILTER
  );
  const airingIdFilter = localStorage.getItem(AIRING_TABLE_AIRING_ID_FILTER);
  const itemNameFilter = localStorage.getItem(AIRING_TABLE_ITEM_NAME_FILTER);
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
  let queryUrl: string = '';
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
    if (rawFiltersToShow.some((f) => f.value !== null)) {
      void dispatch(filterTableAirings(queryUrl));
    } else {
      void dispatch(getTableAirings());
    }
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
  const rawPreviousCursor = localStorage.getItem(
    AIRING_TABLE_PREVIOUS_TABLE_CURSOR_KEY
  );
  let initialPreviousCursor: string[] = DEFAULT_PREVIOUS_CURSOR;
  if (rawPreviousCursor !== undefined && rawPreviousCursor !== null) {
    initialPreviousCursor = JSON.parse(rawPreviousCursor);
  }

  let initialRowsPerPage = localStorage.getItem(AIRING_TABLE_ROWS_PER_PAGE_KEY);
  if (
    initialRowsPerPage === '' ||
    initialRowsPerPage === undefined ||
    initialRowsPerPage === null
  ) {
    initialRowsPerPage = DEFAULT_PER_PAGE;
  }

  const rawPage = localStorage.getItem(AIRING_TABLE_PAGE_KEY);
  let initialPage = 0;
  if (rawPage !== '' && rawPage !== undefined && rawPage !== null) {
    initialPage = JSON.parse(rawPage);
  }

  const [page, setPage] = useState<number>(initialPage);
  const [previousCursor, setPreviousCursor] = useState<Array<number | string>>(
    initialPreviousCursor
  );
  const [sortKey, setSortKey] = useState<string>('airing_time');
  const [sortKeyType, setKeyType] = useState<SortKey>('date');
  const [isDesc, setDesc] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    parseInt(initialRowsPerPage, 10)
  );
  useEffect(() => {
    if (queryUrl.length > 2) {
      void dispatch(filterTableAirings(queryUrl));
    } else {
      void dispatch(getTableAirings());
    }
  }, [dispatch]);
  const handleChangePage = (_: unknown, newPage: number): void => {
    if (airingsStatus === 'pending') {
      return;
    }

    if (newPage > page) {
      if (nextCursor !== null) {
        localStorage.setItem(AIRING_TABLE_CURSOR_KEY, nextCursor);
      }
      const newPreviousCursorArr = JSON.parse(JSON.stringify(previousCursor));
      newPreviousCursorArr.push(cursor);
      localStorage.setItem(
        AIRING_TABLE_PREVIOUS_TABLE_CURSOR_KEY,
        JSON.stringify(newPreviousCursorArr)
      );
      setPreviousCursor(newPreviousCursorArr);
    } else {
      if (page === 0) {
        return;
      }

      if (cursor != null) {
        localStorage.setItem(AIRING_TABLE_NEXT_CURSOR_KEY, cursor);
      }
      localStorage.setItem(
        AIRING_TABLE_CURSOR_KEY,
        previousCursor[previousCursor.length - 1].toString()
      );
      const newPreviousCursorArr = JSON.parse(JSON.stringify(previousCursor));
      newPreviousCursorArr.pop();
      localStorage.setItem(
        AIRING_TABLE_PREVIOUS_TABLE_CURSOR_KEY,
        JSON.stringify(newPreviousCursorArr)
      );
      setPreviousCursor(newPreviousCursorArr);
    }

    void dispatch(getTableAirings());
    setPage(newPage);
    localStorage.setItem(AIRING_TABLE_PAGE_KEY, newPage.toString());
  };

  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(Number(e.target.value));
    localStorage.setItem(
      AIRING_TABLE_ROWS_PER_PAGE_KEY,
      JSON.stringify(Number(e.target.value))
    );
    localStorage.setItem(AIRING_TABLE_CURSOR_KEY, DEFAULT_CURSOR);
    localStorage.setItem(
      AIRING_TABLE_PREVIOUS_TABLE_CURSOR_KEY,
      JSON.stringify(DEFAULT_PREVIOUS_CURSOR)
    );
    void dispatch(getTableAirings());
    localStorage.setItem(AIRING_TABLE_PAGE_KEY, '0');
    setPage(0);
  };

  const headerClickHandler = (key: string): void => {
    const isCurrentKey = key === sortKey;
    if (isCurrentKey) {
      setDesc(!isDesc);
      return;
    }

    setKeyType(headerTypeHashmap[key]);
    setDesc(false);
    setSortKey(key);
  };

  const applySort = (a: any, b: any): number => {
    if (sortKeyType === 'numeric') {
      const firstNum = Number(a[sortKey]);
      const secondNum = Number(b[sortKey]);
      if (firstNum > secondNum) {
        return 1;
      }

      if (firstNum < secondNum) {
        return -1;
      }
    }

    if (sortKeyType === 'date') {
      const dateA = new Date(a[sortKey]);
      const dateB = new Date(b[sortKey]);
      if (dateA < dateB) {
        return 1;
      }

      if (dateA > dateB) {
        return -1;
      }
    }

    if (sortKeyType === 'string') {
      return a[sortKey].localeCompare(b[sortKey]);
    }

    return -1;
  };

  const copyOfAirings = JSON.parse(
    JSON.stringify(airings !== undefined ? airings : [])
  );
  const sortedAirings = isDesc
    ? copyOfAirings.sort(applySort).reverse()
    : copyOfAirings.sort(applySort);
  const rows = sortedAirings.map((airing: Airing) => (
    <AiringTableRow key={airing.ID} data={airing} />
  ));
  return (
    <section className="admin-data__container">
      <section className="airing-filters__container">{filtersToShow}</section>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 750 }}>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F5f5f5' }}>
                {columns(sortKey, isDesc, headerClickHandler)}
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: 'none' }}>{rows}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={DEFAULT_ROW_OPTS}
          component="div"
          count={airingTotal}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </section>
  );
}

export default AiringTable;
