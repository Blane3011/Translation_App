import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY || "dummy_key";
const APP_ID = process.env.APP_ID || "dummy_app_id";

// ===== Middleware FIRST =====
app.use(express.json());

app.use(cors({
  origin: "https://blane3011.github.io",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

// ===== Health check (IMPORTANT for Render) =====
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post('/translate', async (req, res) => {
  const { q, source, target } = req.body;
  if (!q || !source || !target) return res.status(400).json({ error: "Missing parameters" });

  const response = await fetch("https://libretranslate-server-production.up.railway.app/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q, source, target, format: "text" })
  });
  const data = await response.json();
  res.json(data); 
});

try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("Server failed to start:", err);
  process.exit(1);
}