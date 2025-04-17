const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Встановлюємо базовий URL для Mistral API
const MISTRAL_API_BASE = "https://api.mistral.ai";

// Логування кожного запиту, що надходить
app.use("/", async (req, res) => {
  console.log('Request received:', req.method, req.originalUrl); // Логуємо метод і URL запиту
  try {
    const url = `${MISTRAL_API_BASE}${req.originalUrl}`;
    console.log('Forwarding request to:', url); // Логуємо, на який URL ми перенаправляємо запит

    const response = await axios({
      method: req.method,
      url,
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`, // додаємо API ключ
        ...req.headers,
      },
      data: req.body,
    });

    console.log('Response:', response.data); // Логуємо відповідь сервера
    res.status(response.status).send(response.data); // Відправляємо відповідь назад
  } catch (error) {
    console.error('Error:', error.response?.data || error.message); // Логуємо помилку
    res.status(error.response?.status || 500).send(error.response?.data || { error: "Unknown error" });
  }
});

// Запуск сервера на вказаному порту
app.listen(port, () => {
  console.log(`Mistral proxy server running on port ${port}`);
});
