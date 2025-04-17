const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000; // Використовуй порт 10000, якщо це на Render

const apiKey = process.env.API_KEY;
const MISTRAL_API_BASE = "https://api.mistral.ai/v1"; // Базовий URL для Mistral API

app.use(cors());
app.use(express.json());

// Логування запиту
app.use("/v1", async (req, res) => {
  console.log("Request body:", req.body);  // Логування запиту (записуємо весь запит, щоб побачити, що приходить)

  const url = `${MISTRAL_API_BASE}${req.originalUrl.replace(/^\/v1/, "")}`;

  try {
    const response = await axios({
      method: req.method,  // використовуємо метод запиту (POST/GET тощо)
      url,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      data: req.body,  // додаємо тіло запиту (це може бути важливим для POST запитів)
    });

    // Відправляємо відповідь назад клієнту
    res.status(response.status).send(response.data);
  } catch (error) {
    // Логуємо помилку, якщо вона є
    console.error("Error:", error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).send(error.response?.data || { error: "Unknown error" });
  }
});

// Слухаємо на порту 10000
app.listen(port, () => {
  console.log(`Mistral proxy server running on port ${port}`);
});
