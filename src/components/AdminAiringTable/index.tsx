import { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";

import AdminTableRow from "./AdminTableRow";

import { useAppDispatch, useAppSelector } from "../../config/hooks";

import { clearAirings, getAdminAirings } from "../../actions/airings";

import { Airing, HeaderHash, SortKey } from "../../@types";
import {
  ADMIN_NEXT_TABLE_CURSOR_KEY,
  ADMIN_PAGE_KEY,
  ADMIN_PREVIOUS_TABLE_CURSOR_KEY,
  ADMIN_ROWS_PER_PAGE_KEY,
  ADMIN_TABLE_CURSOR_KEY,
  DEFAULT_ADMIN_PER_PAGE,
  DEFAULT_CURSOR,
  DEFAULT_PREVIOUS_CURSOR,
  DEFAULT_ROW_OPTS,
  DIGITAL_AGENDA_TABLE_HEADERS,
} from "../../constants";
import formatRowHeaders from "../../modules/formatRowHeaders";

const StyledTableCellHeader = styled(TableCell)(() => ({
  backgroundColor: "#F5F5F5",
  fontFamily: "Neue Haas Grotesk Text Pro",
  fontWeight: "600",
  textAlign: "center",
}));

const headerTypeHashmap: HeaderHash = {
  item_name: "string",
  item_number: "string",
  airing_id: "string",
  airing_time: "date",
  show: "string",
  price: "numeric",
  station: "string",
};

const columns = (sortKey: string, isDesc: boolean, onClick: Function) =>
  DIGITAL_AGENDA_TABLE_HEADERS.filter(
    (k) => k !== "highlights" && k !== "attributes" && k !== "images"
  ).map((key) => (
    <StyledTableCellHeader
      align="right"
      padding="normal"
      key={key}
      sx={{ color: "darkgrey", width: 60, textAlign: "center" }}
    >
      <TableSortLabel
        active={sortKey === key}
        direction={isDesc ? "desc" : "asc"}
        onClick={() => onClick(key)}
      >
        {formatRowHeaders(key)}
        {sortKey === key && (
          <Box component="span" sx={visuallyHidden}>
            {isDesc ? "sorted descending" : "sorted ascending"}
          </Box>
        )}
      </TableSortLabel>
    </StyledTableCellHeader>
  ));

export const StyledTableCell = styled(TableCell)(() => ({
  border: "none",
  fontWeight: "500",
  textAlign: "center",
  fontFamily: "Neue Haas Grotesk Text Pro",
}));

interface AdminAiringTableProps {
  handleDeleteClick: (airing: Airing) => void;
  handleEditClick: (airing: Airing) => void;
}

function AdminAiringTable({
  handleDeleteClick,
  handleEditClick,
}: AdminAiringTableProps): JSX.Element {
  const dispatch = useAppDispatch();
  const airings = useAppSelector((state) => state.airings.adminAirings);
  const airingsStatus = useAppSelector((state) => state.airings.status);
  let cursor = localStorage.getItem(ADMIN_TABLE_CURSOR_KEY);
  if (cursor === "" || cursor === undefined || cursor === null) {
    cursor = "1";
  }
  const numOfShoppingBlocksToday = useAppSelector(
    (state) => state.airings.numOfShoppingBlocksToday
  );
  const numOfInfomercialsToday = useAppSelector(
    (state) => state.airings.numOfInfomericalsToday
  );
  const airingTotal = useAppSelector((state) => state.airings.airingTotal);
  let nextCursor = localStorage.getItem(ADMIN_NEXT_TABLE_CURSOR_KEY);
  if (nextCursor === "" || nextCursor === undefined || nextCursor === null) {
    nextCursor = DEFAULT_CURSOR;
  }

  let rawPreviousCursor = localStorage.getItem(ADMIN_PREVIOUS_TABLE_CURSOR_KEY);
  let initialPreviousCursor: Array<string> = DEFAULT_PREVIOUS_CURSOR;
  if (rawPreviousCursor !== undefined && rawPreviousCursor !== null) {
    initialPreviousCursor = JSON.parse(rawPreviousCursor as string);
  }
  let initialRowsPerPage = localStorage.getItem(ADMIN_ROWS_PER_PAGE_KEY);
  if (
    initialRowsPerPage === "" ||
    initialRowsPerPage === undefined ||
    initialRowsPerPage === null
  ) {
    initialRowsPerPage = DEFAULT_ADMIN_PER_PAGE;
  }
  const rawPage = localStorage.getItem(ADMIN_PAGE_KEY);
  let initialPage = 0;
  if (rawPage !== "" && rawPage !== undefined && rawPage !== null) {
    initialPage = JSON.parse(rawPage as string);
  }

  const numOfAiringsToday = useAppSelector(
    (state) => state.airings.numOfAiringsToday
  );
  const [page, setPage] = useState<number>(initialPage);
  const [previousCursor, setPreviousCursor] = useState<Array<number | string>>(
    initialPreviousCursor
  );
  const [sortKey, setSortKey] = useState<string>("item_name");
  const [sortKeyType, setKeyType] = useState<SortKey>("string");
  const [isDesc, setDesc] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    parseInt(initialRowsPerPage, 10)
  );
  useEffect(() => {
    dispatch(clearAirings());
  }, [dispatch]);
  const handleChangePage = (_: unknown, newPage: number) => {
    if (airingsStatus === "pending") {
      return;
    }
    if (newPage > page) {
      localStorage.setItem(ADMIN_TABLE_CURSOR_KEY, nextCursor as string);
      const newPreviousCursorArr = JSON.parse(JSON.stringify(previousCursor));
      newPreviousCursorArr.push(cursor as string);
      localStorage.setItem(
        ADMIN_PREVIOUS_TABLE_CURSOR_KEY,
        JSON.stringify(newPreviousCursorArr)
      );
      setPreviousCursor(newPreviousCursorArr);
    } else {
      if (page === 0) {
        return;
      }
      localStorage.setItem(ADMIN_NEXT_TABLE_CURSOR_KEY, cursor as string);
      localStorage.setItem(
        ADMIN_TABLE_CURSOR_KEY,
        previousCursor[previousCursor.length - 1].toString()
      );
      const newPreviousCursorArr = JSON.parse(JSON.stringify(previousCursor));
      newPreviousCursorArr.pop();
      localStorage.setItem(
        ADMIN_PREVIOUS_TABLE_CURSOR_KEY,
        JSON.stringify(newPreviousCursorArr)
      );
      setPreviousCursor(newPreviousCursorArr);
    }
    dispatch(getAdminAirings());
    setPage(newPage);
    localStorage.setItem(ADMIN_PAGE_KEY, newPage.toString());
  };
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    localStorage.setItem(
      ADMIN_ROWS_PER_PAGE_KEY,
      JSON.stringify(+e.target.value)
    );
    localStorage.setItem(ADMIN_TABLE_CURSOR_KEY, DEFAULT_CURSOR);
    localStorage.setItem(
      ADMIN_PREVIOUS_TABLE_CURSOR_KEY,
      JSON.stringify(DEFAULT_PREVIOUS_CURSOR)
    );
    dispatch(getAdminAirings());
    localStorage.setItem(ADMIN_PAGE_KEY, "0");
    return setPage(0);
  };
  const headerClickHandler = (key: string) => {
    const isCurrentKey = key === sortKey;
    if (isCurrentKey) {
      return setDesc(!isDesc);
    }
    setKeyType(headerTypeHashmap[key]);
    setDesc(false);
    return setSortKey(key);
  };
  const applySort = (a: any, b: any): number => {
    if (sortKeyType === "numeric") {
      const firstNum = +a[sortKey];
      const secondNum = +b[sortKey];
      if (firstNum > secondNum) {
        return 1;
      }
      if (firstNum < secondNum) {
        return -1;
      }
    }
    if (sortKeyType === "date") {
      const dateA = new Date(a[sortKey]);
      const dateB = new Date(b[sortKey]);
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
    }
    if (sortKeyType === "string") {
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
    <AdminTableRow
      handleDeleteClick={handleDeleteClick}
      handleEditClick={handleEditClick}
      key={airing.ID}
      data={airing}
    />
  ));
  return (
    <section className="admin-data__container">
      <h5>Overview</h5>
      <section className="data-overview__container">
        <article className="data-header__container">
          <h4>{numOfAiringsToday}</h4>
          <h6>Showings Today</h6>
        </article>
        <article className="data-header__container">
          <h4>{numOfInfomercialsToday}</h4>
          <h6>Infomercials Today</h6>
        </article>
        <article className="data-header__container">
          <h4>{numOfShoppingBlocksToday}</h4>
          <h6>Shopping Channels Today</h6>
        </article>
      </section>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 750 }}>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F5f5f5" }}>
                {columns(sortKey, isDesc, headerClickHandler)}
                <StyledTableCellHeader />
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: "none" }}>{rows}</TableBody>
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

export default AdminAiringTable;
