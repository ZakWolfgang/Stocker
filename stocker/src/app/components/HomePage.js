'use client'
import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import homePage from './homePage.css'
import Table from './Table.js'

const HomePage = () => {
  return (
        <Box sx={{ width: '80%', maxWidth: '800px', margin: '0 auto', marginTop: '10px'}}>
          <h1>Stock Tracker</h1>
          <Table />
        </Box>
  )
}

export default HomePage
