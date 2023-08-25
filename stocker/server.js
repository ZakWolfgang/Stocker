const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { data } = require('autoprefixer');

const app = express();
const PORT = 3001;
const TIINGO_API_KEY = 'ac2196ed8f72aa12313fdb86a5f246f777444b2c'; // Replace with your key or use environment variables
const BASE_URL = 'https://api.tiingo.com/iex';

app.use(cors()); // Enable CORS for all routes

app.get('/getStockData/:ticker', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/${req.params.ticker}`, {
            headers: {
                Authorization: `Token ${TIINGO_API_KEY}`,
            },
        });
        console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
