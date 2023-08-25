"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";

const BASE_URL = "https://api.tiingo.com/iex";
const apiKey = "ac2196ed8f72aa12313fdb86a5f246f777444b2c"; //process.env.TIINGO_API_KEY;

export const getStockData = async (ticker) => {
  try {
    const response = await axios.get(`${BASE_URL}/?token=${apiKey}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "ticker", numeric: false, disablePadding: true, label: "Ticker" },
  { id: "last", numeric: true, disablePadding: false, label: "Last Price" },
  {
    id: "prevClose",
    numeric: true,
    disablePadding: false,
    label: "Previous Close",
  },
  { id: "open", numeric: true, disablePadding: false, label: "Open Price" },
  { id: "high", numeric: true, disablePadding: false, label: "High Price" },
  { id: "low", numeric: true, disablePadding: false, label: "Low Price" },
  {
    id: "percentChange",
    numeric: true,
    disablePadding: false,
    label: "Percent Change",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding="dense"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Top 20 Movers
        </Typography>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("ticker");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [stocks, setStocks] = React.useState([]);

  //calc stock percentage change
  const calculateMovement = (stock) => {
    return stock.last - stock.open;
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStocks(prevStocks => [
        {
          ...prevStocks[0],
          last: Math.round(Math.random() * 100)
        },
        ...prevStocks.slice(1)
      ]);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    getStockData()
      .then((data) => {
        // Sort the stocks based on movement and take the top 20
        const sortedStocks = data
          .sort((a, b) => calculateMovement(b) - calculateMovement(a))
          .slice(0, 20);
        setStocks(sortedStocks);
        console.log("Fetched and sorted data:", sortedStocks);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stocks.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(stocks, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "10vh",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "80%" }}>
        <Paper sx={{ width: "100%", borderRadius: "16px" }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer sx={{ paddingLeft: "16px", paddingRight: "16px" }}>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={stocks.length}
              />
              <TableBody>
                {visibleRows.map((stock, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const percentChange =
                    ((stock.last - stock.open) / stock.open) * 100;
                  return (
                    <TableRow hover tabIndex={-1} key={stock.ticker}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="dense"
                      >
                        {stock.ticker}
                      </TableCell>
                      <TableCell align="right" padding="dense">
                        {stock.last}
                      </TableCell>
                      <TableCell align="right" padding="dense">
                        {stock.prevClose}
                      </TableCell>
                      <TableCell align="right" padding="dense">
                        {stock.open}
                      </TableCell>
                      <TableCell align="right" padding="dense">
                        {stock.high}
                      </TableCell>
                      <TableCell align="right" padding="dense">
                        {stock.low}
                      </TableCell>
                      <TableCell align="right" padding="dense">
                        {percentChange.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={stocks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Compact"
        />
      </Box>
    </Box>
  );
}
