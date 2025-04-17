const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MISTRAL_API_BASE = "https://api.mistral.ai/v1";

app.use("/v1", async (req, res) => {
  try {
    const url = `${MISTRAL_API_BASE}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url,
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        ...req.headers,
      },
      data: req.body,
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || { error: "Unknown error" });
  }
});

app.listen(port, () => {
  console.log(`Mistral proxy server running on port ${port}`);
});