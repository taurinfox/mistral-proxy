const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;

const apiKey = process.env.API_KEY;
const MISTRAL_API_BASE = "https://api.mistral.ai/v1";

app.use(cors());
app.use(express.json());

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await axios.post(
      `${MISTRAL_API_BASE}/chat/completions`,
      req.body,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json(error.response?.data || {
      error: "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`Mistral proxy server running on port ${port}`);
});
