import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/api/ticker/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    let response = await fetch(`https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev?ticker=${ticker}`);
    let data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch data.');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
