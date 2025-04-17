const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000; // Використовуємо порт 10000 як в твоєму налаштуванні на Render

const apiKey = process.env.API_KEY; // Твій API ключ Mistral
const MISTRAL_API_BASE = "https://api.mistral.ai/v1"; // Базовий URL для Mistral API

// Налаштування CORS та парсинг JSON
app.use(cors());
app.use(express.json());

// Проксі для запитів через /v1
app.post("/v1/chat/completions", async (req, res) => {
  // Створюємо URL для запиту до Mistral API
  const url = `${MISTRAL_API_BASE}${req.originalUrl}`;

  try {
    // Виконуємо POST-запит до Mistral API
    const response = await axios({
      method: 'POST',
      url,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      data: req.body, // Передаємо тіло запиту
    });

    // Відправляємо відповідь на запит до JanitorAI
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error:", error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).send(error.response?.data || { error: "Unknown error" });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Mistral proxy server running on port ${port}`);
});
