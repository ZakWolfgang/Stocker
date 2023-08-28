"use client";
import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import homePage from "./homePage.css";
import Table from "./Table.js";
import Card from "./Card.js";

const HomePage = () => {
  return (
    <Box
      sx={{
        width: "90%",
        flexGrow: 1,
        margin: "0 auto",
        marginTop: "10px",
      }}
    >
      <Grid container spacing={2} justifyContent="center" >
        <Grid item xs={6}>
          <Table />
        </Grid>
        <Grid item xs={2}>
          <Card />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
