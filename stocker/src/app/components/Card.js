import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";


const BASE_URL = "https://api.tiingo.com/iex";

async function getStockData(ticker, apiKey) {
  try {
    const response = await axios.get(`${BASE_URL}/${ticker}?token=${apiKey}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}

export default function BasicCard({ tickers, apiKey, title }) {
  const [responses, setResponses] = React.useState(null);

  React.useEffect(() => {
    Promise.all(tickers.map((ticker) => getStockData(ticker, apiKey)))
      .then((data) => setResponses(data))
      .catch((error) => console.error("Error fetching stock data:", error));
  }, [tickers, apiKey]);

  return (
    <Card sx={{ width: "100%", borderRadius: 5, marginBottom: '3vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent sx={{ padding: 0 }}>
        <Typography variant="subtitle1" component="div" sx={{ padding: '16px', fontWeight: 'bold', fontSize: '2vh' }}>
          {title}
        </Typography>
        <Divider />
        <Box sx={{ padding: '16px' }}>
          {responses ? (
            responses.map((response, index) => (
              <Typography key={index} variant="body2">
                {response[0].ticker}: ${response[0].tngoLast}
              </Typography>
            ))
          ) : (
            <Typography variant="h5" component="div" sx={{ textAlign: 'center'}}>
              Loading...
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
