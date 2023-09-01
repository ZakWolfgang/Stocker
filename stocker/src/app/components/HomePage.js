"use client";
import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Table from "./Table.js";
import Card from "./Card.js";
import WatchlistCard from "./WatchlistCard.js";

const HomePage = () => {
  const [watchlist, setWatchlist] = React.useState([]);

  return (
    <Box
      sx={{
        width: "90%",
        flexGrow: 1,
        margin: "0 auto",
        marginTop: "10px",
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={2} justifyContent="center" alignItems="center">
          <Card
            title="Top Stocks"
            tickers={["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]}
            //apiKey="ac2196ed8f72aa12313fdb86a5f246f777444b2c"
          />
          <WatchlistCard watchlist={watchlist} />
        </Grid>
        <Grid item xs={12} sm={6}>
        <Table watchlist={watchlist} setWatchlist={setWatchlist} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
