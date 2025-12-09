import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { detectEmotion } from "./mood-engine.js";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors());
app.use(express.json());

console.log("HF Mood backend çalışıyor:", `http://localhost:${process.env.PORT}`);

// ===================================
//  TEXT TABANLI DUYGU ANALİZİ ENDPOINTİ
// ===================================
app.post("/api/mood-text", async (req, res) => {
  try {
    const userText = req.body.message || "";

    if (!userText.trim()) {
      return res.status(400).json({
        error: "Mesaj boş olamaz",
      });
    }

    // Manuel duygu tespit motoru
    const { emotion, reply } = detectEmotion(userText);
    const mood = emotion || "belirsiz";

    console.log("Text input:", userText);
    console.log("Detected mood:", mood);

    return res.json({
      mood_label: mood,
      reply,
    });
  } catch (err) {
    console.error("TEXT endpoint error:", err);
    return res.status(500).json({
      error: "Sunucu hatası",
    });
  }
});
// ===================================

// MiniAssistant şu anda /api/mood-text kullanıyor

app.listen(process.env.PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${process.env.PORT}`);
});

