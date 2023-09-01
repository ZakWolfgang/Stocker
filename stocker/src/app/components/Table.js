"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"
import axios from "axios";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import "./table.css";

const BASE_URL = "https://api.tiingo.com/iex";
const apiKey = "ac2196ed8f72aa12313fdb86a5f246f777444b2c";

export const getStockData = async () => {
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

function EnhancedTableToolbar() {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        backgroundColor: "#331832",
        borderRadius: "16px",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Top Market Movers Today
      </Typography>
    </Toolbar>
  );
}

export default function EnhancedTable({ watchlist, setWatchlist }) {
  const [stocks, setStocks] = React.useState([]);

  const addToWatchlist = (ticker, price) => {
    setWatchlist([...watchlist, { ticker, price }]);
  };

  const columns = [
    {
      field: 'addToWatchlist',
      headerName: 'Add to Watchlist',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => addToWatchlist(params.row.ticker, params.row.tngoLast)}
        >
          Add to Watchlist
        </Button>
      ),
    },
    {
      field: "ticker",
      headerName: "Ticker",
      width: 100,
      headerClassName: "header-ticker",
      cellClassName: "cell-ticker",
    },
    {
      field: "tngoLast",
      headerName: "Price",
      type: "number",
      width: 100,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "highLast",
      headerName: "High / Low Price",
      width: 200,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => `${params.row.high} / $${params.row.last}`,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "percentChange",
      headerName: "Percent Change",
      width: 150,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => {
        const percentChange =
          ((params.row.last - params.row.open) / params.row.open) * 100;
        return percentChange.toFixed(2) + "%";
      },
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
      sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
      renderCell: (params) => {
        const value = parseFloat(params.value);
        return (
          <span style={{ color: value < 0 ? "red" : "green" }}>
            {value < 0 ? "↓" : "↑"} {params.value}
          </span>
        );
      },
    },
    { field: "volume", headerName: "Volume", type: "number", width: 150 },
  ];

  //calc stock percentage change
  const calculateMovement = (stock) => {
    return ((stock.last - stock.open) / stock.open) * 100;
  };

  React.useEffect(() => {
    getStockData()
      .then((data) => {
        // Filter the stocks to include only those with a last price over $5
        const filteredStocks = data.filter((stock) => stock.last > 5);
        // Sort the stocks based on movement and take the top 20
        const sortedStocks = filteredStocks
          .sort(
            (a, b) =>
              Math.abs(calculateMovement(b)) - Math.abs(calculateMovement(a))
          )
          .slice(0, 100);
        setStocks(sortedStocks);
        console.log("Fetched and sorted data:", sortedStocks);
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  }, []);

  const visibleRows = React.useMemo(
    () =>
      stocks.map((stock, index) => ({
        id: index,
        ticker: stock.ticker,
        tngoLast: stock.tngoLast,
        volume: stock.volume,
        high: stock.high,
        last: stock.last,
        open: stock.open,
      })),
    [stocks]
  );

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", borderRadius: "16px" }}>
          <EnhancedTableToolbar />
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={visibleRows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[25]}
              getRowClassName={(params) =>
                params.rowIndex % 2 === 0 ? "grey-row" : ""
              }
            />
          </div>
        </Paper>
      </Box>
    </Box>
  );
}
