import { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
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

import AiringTableRow from './AiringTableRow';

import { useAppDispatch, useAppSelector } from '../../config/hooks';

import { getTableAirings } from '../../actions/airings';

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
} from '../../constants';
import formatRowHeaders from '../../modules/formatRowHeaders';

const StyledTableCellHeader = styled(TableCell)(() => ({
  backgroundColor: '#F5F5F5',
  fontFamily: 'Neue Haas Grotesk Text Pro',
  fontWeight: '600',
  textAlign: 'center',
}));

const headerTypeHashmap: HeaderHash = {
  item_name: 'string',
  item_number: 'string',
  airing_id: 'string',
  airing_time: 'date',
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
  const [sortKey, setSortKey] = useState<string>('item_name');
  const [sortKeyType, setKeyType] = useState<SortKey>('string');
  const [isDesc, setDesc] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    parseInt(initialRowsPerPage, 10)
  );
  useEffect(() => {
    void dispatch(getTableAirings());
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
