import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const BASE_URL = "https://api.tiingo.com/iex";
const apiKey = "ac2196ed8f72aa12313fdb86a5f246f777444b2c";

async function getStockData(ticker) {
  try {
    const response = await axios.get(`${BASE_URL}/${ticker}?token=${apiKey}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}

const tickers = ["AAPL", "GOOGL", "MSFT"];

export default function BasicCard() {
  const [responses, setResponses] = React.useState(null);

  React.useEffect(() => {
    Promise.all(tickers.map((ticker) => getStockData(ticker)))
      .then((data) => setResponses(data))
      .catch((error) => console.error("Error fetching stock data:", error));
  }, []);

  return (
    <Card sx={{ width: "80%", borderRadius: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Stock Data
        </Typography>
        {responses ? (
          responses.map((response, index) => (
            <Typography key={index} variant="body2">
              {response[0].ticker}: ${response[0].tngoLast}
            </Typography>
          ))
        ) : (
          <Typography variant="h5" component="div">
            Loading...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
