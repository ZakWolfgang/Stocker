"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';

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

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 150 },
  { field: 'open', headerName: 'Open Price', type: 'number', width: 150 },
  { field: 'high', headerName: 'High Price', type: 'number', width: 150 },
  { field: 'low', headerName: 'Low Price', type: 'number', width: 150 },
  {
    field: 'percentChange',
    headerName: 'Percent Change',
    type: 'number',
    width: 150,
    valueGetter: (params) => ((params.row.last - params.row.open) / params.row.open) * 100,
  },
];

function EnhancedTableToolbar() {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Top 20 Movers
      </Typography>
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const [dense, setDense] = React.useState(false);
  const [stocks, setStocks] = React.useState([]);

  //calc stock percentage change
  const calculateMovement = (stock) => {
    return stock.last - stock.open;
  };

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

  const visibleRows = React.useMemo(
    () => stocks.map((stock, index) => ({
      id: index,
      ticker: stock.ticker,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      last: stock.last,
    })),
    [stocks]
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", display: "center" }}>
        <Paper sx={{ width: "100%", borderRadius: "16px" }}>
          <EnhancedTableToolbar />
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={visibleRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </Paper>
      </Box>
    </Box>
  );
}
