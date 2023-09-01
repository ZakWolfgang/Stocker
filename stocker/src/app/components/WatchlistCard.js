import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export default function WatchlistCard({ watchlist }) {
    return (
      <Card sx={{ width: "100%", borderRadius: 5, marginBottom: '3vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent sx={{ padding: 0 }}>
          <Typography variant="subtitle1" component="div" sx={{ padding: '16px', fontWeight: 'bold', fontSize: '2vh' }}>
            Watchlist
          </Typography>
          <Divider />
          <Box sx={{ padding: '16px' }}>
            {watchlist.length > 0 ? (
              watchlist.map((stock, index) => (
                <Typography key={index} variant="body2">
                  {stock.ticker}: ${stock.price}
                </Typography>
              ))
            ) : (
              <Typography variant="h5" component="div" sx={{ textAlign: 'center'}}>
                No stocks in watchlist
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }