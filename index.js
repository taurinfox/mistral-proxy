const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.API_KEY;
const MISTRAL_API_BASE = "https://api.mistral.ai/v1";

app.use(cors());
app.use(express.json());

app.use("/v1", async (req, res) => {
  const url = `${MISTRAL_API_BASE}${req.originalUrl.replace(/^\/v1/, "")}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      data: req.body,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error:", error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).send(error.response?.data || { error: "Unknown error" });
  }
});

app.listen(port, () => {
  console.log(`Mistral proxy server running on port ${port}`);
});
