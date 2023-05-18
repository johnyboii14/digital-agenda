import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

import DataRow from "./DataRow";

import { HeaderHash, EVENT, SortKey } from "../../@types";

import {
  DEFAULT_ROW_OPTS,
  DIGITAL_AGENDA_TABLE_HEADERS,
} from "../../constants";
import formatRowHeaders from "../../modules/formatRowHeaders";
import { useAppDispatch, useAppSelector } from "../../config/hooks";
import { getEvents } from "../../actions/events";

const StyledTableCellHeader = styled(TableCell)(() => ({
  backgroundColor: "#C09243",
}));

const StyledTableCellActionCol = styled(TableCell)(() => ({
  backgroundColor: "#C09243",
  width: 20,
}));

const columns = (sortKey: string, isDesc: boolean, onClick: Function) =>
  DIGITAL_AGENDA_TABLE_HEADERS.filter((k) => k).map((key) => (
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

export interface AiringTableProps {
  events: Array<EVENT>;
}

const headerTypeHashmap: HeaderHash = {
  description: "string",
  item_no: "string",
  airing_id: "string",
  showing_time: "date",
  show: "string",
  price: "numeric",
};

function AiringsTable({ events }: AiringTableProps) {
  const dispatch = useAppDispatch();
  const eventStatus = useAppSelector((state) => state.events.status);
  const airings = useAppSelector((state) => state.events.events);
  const [page, setPage] = useState<number>(0);
  const [sortKey, setSortKey] = useState<string>("description");
  const [sortKeyType, setKeyType] = useState<SortKey>("string");
  const [isDesc, setDesc] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [savedEvents, setEvents] = useState<Array<EVENT>>([]);
  useEffect(() => {
    if (eventStatus === "idle") {
      dispatch(getEvents());
    }
    if (eventStatus === "succeeded") {
      setEvents(airings);
    }
  }, [airings, eventStatus, dispatch]);
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
  const copyOfProducts = JSON.parse(JSON.stringify(events));
  const currentPage = page * rowsPerPage;
  const trailingPage = page * rowsPerPage + rowsPerPage;
  const productsToShow = copyOfProducts.slice(currentPage, trailingPage);
  const rows = copyOfProducts.map((p: EVENT) => (
    <DataRow event={p} key={p.id} />
  ));

  return (
    <div className="main-page-style">
      <section>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 750 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "black" }}>
                  {columns(sortKey, isDesc, headerClickHandler)}
                </TableRow>
              </TableHead>
              <TableBody sx={{ border: "none" }}>{rows}</TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={DEFAULT_ROW_OPTS}
            component="div"
            count={events.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </section>
    </div>
  );
}

export default AiringsTable;
