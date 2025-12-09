import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import fetch from "node-fetch";
import { detectEmotion } from "./mood-engine.js";
import { emotionCategoryMap } from "./osm-map.js";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

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

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exists = await prisma.user.findUnique({
      where: { email }
    });

    if (exists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: { email, password }
    });

    res.json({ message: "User created", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ======================================================
//  RUH HALİ KAYIT ENDPOINTİ  (POST /save-mood)
// ======================================================
app.post("/save-mood", async (req, res) => {
  try {
    const { userId, emotion, message } = req.body;

    if (!userId || !emotion) {
      return res.status(400).json({
        error: "userId ve emotion zorunludur"
      });
    }

    const newMood = await prisma.moodLog.create({
      data: {
        userId,
        emotion,
        message: message || null
      }
    });

    return res.json({
      success: true,
      mood: newMood
    });
  } catch (err) {
    console.error("Save mood error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
});

// ===================================
//  MEKAN ÖNERİ ENDPOINTİ (DÜZELTİLMİŞ)
// ===================================
app.post("/suggest-places", async (req, res) => {
  try {
    const { city, emotion } = req.body;

    if (!city || !emotion) {
      return res.status(400).json({ error: "city ve emotion zorunludur" });
    }

    // Duygu → OSM kategorileri
    const categories = emotionCategoryMap[emotion];
    if (!categories) {
      return res.status(400).json({ error: "Geçersiz emotion" });
    }

    // Overpass API için doğru query formatı
    const query = `
[out:json][timeout:25];
area[name="${city}"][boundary=administrative]->.searchArea;
(
  ${categories.map((tag) => `${tag}(area.searchArea);`).join("\n  ")}
);
out center;
`;

    // RESMİ FORMAT: data=ENCODE(query)
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "data=" + encodeURIComponent(query)
    });

    const data = await response.json();

    return res.json({
      success: true,
      count: data.elements.length,
      places: data.elements.map((p) => ({
        id: p.id,
        name: p.tags?.name || "İsimsiz Mekan",
        type: p.tags?.amenity || p.tags?.leisure || p.tags?.tourism || "unknown",
        lat: p.lat || p.center?.lat,
        lon: p.lon || p.center?.lon,
      })),
    });
  } catch (err) {
    console.error("OSM ERROR:", err);
    return res.status(500).json({ error: "OSM verisi alınamadı" });
  }
});

// MiniAssistant şu anda /api/mood-text kullanıyor

app.listen(process.env.PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${process.env.PORT}`);
});

