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

import { useAppDispatch, useAppSelector } from "../../config/hooks";

import { clearAirings } from "../../actions/airings";

import { Airing, HeaderHash, SortKey } from "../../@types";
import {
  DEFAULT_ROW_OPTS,
  DIGITAL_AGENDA_TABLE_HEADERS,
} from "../../constants";
import formatRowHeaders from "../../modules/formatRowHeaders";
import AdminTableRow from "./AdminTableRow";

const StyledTableCellHeader = styled(TableCell)(() => ({
  backgroundColor: "#F5F5F5",
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
      sx={{ color: "white", width: 60, textAlign: "center" }}
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
  fontWeight: "600",
  textAlign: "center",
  fontFamily: "Montserrat",
}));

function AdminAiringTable(): JSX.Element {
  const dispatch = useAppDispatch();
  const airings = useAppSelector((state) => state.airings.airings);
  const airingsForToday = airings.filter((airing) => {
    const airingDate = new Date(airing.airing_time);
    const today = new Date();
    return today.getDate() === airingDate.getDate();
  });
  const infomercialsToday = airingsForToday.filter(
    (airing) => airing.type === "Infomercial"
  );
  const shoppingBlocksToday = airingsForToday.filter(
    (airing) => airing.type === "ShoppingBlock"
  );
  useEffect(() => {
    dispatch(clearAirings());
  }, [dispatch]);
  const [page, setPage] = useState<number>(0);
  const [sortKey, setSortKey] = useState<string>("item_name");
  const [sortKeyType, setKeyType] = useState<SortKey>("string");
  const [isDesc, setDesc] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
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
  const copyOfAirings = JSON.parse(JSON.stringify(airings));
  const sortedAirings = isDesc
    ? copyOfAirings.sort(applySort).reverse()
    : copyOfAirings.sort(applySort);
  const currentPage = page * rowsPerPage;
  const trailingPage = page * rowsPerPage + rowsPerPage;
  const airingsToShow = sortedAirings.slice(currentPage, trailingPage);
  const rows = airingsToShow.map((airing: Airing) => (
    <AdminTableRow key={airing.ID} data={airing} />
  ));
  return (
    <section className="admin-data__container">
      <header>Overview</header>
      <section className="data-overview__container">
        <article className="data-header__container">
          <h4>{airingsForToday.length}</h4>
          <h6>Showings Today</h6>
        </article>
        <article className="data-header__container">
          <h4>{infomercialsToday.length}</h4>
          <h6>Infomercials Today</h6>
        </article>
        <article className="data-header__container">
          <h4>{shoppingBlocksToday.length}</h4>
          <h6>Shopping Channels Today</h6>
        </article>
      </section>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 750 }}>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F5f5f5" }}>
                {columns(sortKey, isDesc, headerClickHandler)}
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: "none" }}>{rows}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={DEFAULT_ROW_OPTS}
          component="div"
          count={airings.length}
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
