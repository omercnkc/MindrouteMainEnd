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
//  ŞEHİR NORMALİZASYON FONKSİYONU
// ===================================
const normalizeCity = (text) => {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g");
};

// ===================================
//  ŞEHİR KOORDİNATLARI LOOKUP TABLOSU
// ===================================
const cityCoords = {
  istanbul: { lat: 41.015137, lon: 28.97953 },
  ankara: { lat: 39.92077, lon: 32.85411 },
  izmir: { lat: 38.423733, lon: 27.142826 },
  antalya: { lat: 36.88414, lon: 30.70563 },
  bursa: { lat: 40.18257, lon: 29.06651 },
  adana: { lat: 36.99142, lon: 35.33083 },
  gaziantep: { lat: 37.05944, lon: 37.3825 },
  konya: { lat: 37.87417, lon: 32.49306 },
  kayseri: { lat: 38.7225, lon: 35.4875 },
  mersin: { lat: 36.8000, lon: 34.6333 },
  diyarbakir: { lat: 37.9100, lon: 40.2400 },
  eskisehir: { lat: 39.7767, lon: 30.5206 },
  samsun: { lat: 41.2867, lon: 36.3300 },
  denizli: { lat: 37.7765, lon: 29.0864 },
  malatya: { lat: 38.3552, lon: 38.3095 },
  sanliurfa: { lat: 37.1674, lon: 38.7955 },
  kahramanmaras: { lat: 37.5858, lon: 36.9371 },
  van: { lat: 38.4891, lon: 43.4089 },
  batman: { lat: 37.8814, lon: 41.1351 },
  elazig: { lat: 38.6747, lon: 39.2228 },
};

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

    // Şehir adını normalize et
    const normalizedCity = normalizeCity(city);

    // Duygu → OSM kategorileri
    const categories = emotionCategoryMap[emotion];
    if (!categories) {
      return res.status(400).json({ error: "Geçersiz emotion" });
    }

    // Şehir koordinatı bulma - önce lookup tablosundan, yoksa Nominatim'den
    let cityLat, cityLon;
    
    if (cityCoords[normalizedCity]) {
      cityLat = cityCoords[normalizedCity].lat;
      cityLon = cityCoords[normalizedCity].lon;
    } else {
      try {
        const nominatimRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
          {
            headers: {
              'User-Agent': 'MindRoute/1.0'
            }
          }
        );
        const nominatimData = await nominatimRes.json();
        
        if (nominatimData.length > 0) {
          cityLat = parseFloat(nominatimData[0].lat);
          cityLon = parseFloat(nominatimData[0].lon);
        } else {
          cityLat = cityCoords["istanbul"].lat;
          cityLon = cityCoords["istanbul"].lon;
        }
      } catch (err) {
        cityLat = cityCoords["istanbul"].lat;
        cityLon = cityCoords["istanbul"].lon;
      }
    }

    // Overpass API query - bbox kullanarak şehir merkezine yakın mekanlar
    const bbox = `${cityLat - 0.1},${cityLon - 0.1},${cityLat + 0.1},${cityLon + 0.1}`;
    const query = `
[out:json][timeout:25];
(
  ${categories.map((tag) => `${tag}(bbox:${bbox});`).join("\n  ")}
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

    // XML kontrolü - Overpass rate-limit veya hata durumunda XML döner
    const rawText = await response.text();
    
    // Eğer XML hata mesajı geldiyse:
    if (rawText.trim().startsWith("<")) {
      console.log("❌ Overpass XML döndürdü → rate limit veya server error");
      return res.json({
        success: true,
        count: 0,
        places: []
      });
    }

    // JSON'a çevir (artık güvenli)
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.log("❌ JSON Parse Hatası:", err);
      return res.json({
        success: true,
        count: 0,
        places: []
      });
    }

    // Overpass sonuçları kontrol
    if (!data.elements || data.elements.length === 0) {
      return res.json({
        success: true,
        count: 0,
        places: []
      });
    }

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
    // Hata durumunda bile boş array döndür, frontend çökmesin
    return res.json({
      success: true,
      count: 0,
      places: []
    });
  }
});

// ===================================
//  MEKAN ÖNERİ ENDPOINTİ (GET - TAM SÜRÜM)
// ===================================
app.get("/api/suggest", async (req, res) => {
  try {
    const { city, mood } = req.query;

    if (!city || !mood) {
      return res.status(400).json({ 
        success: false,
        error: "city ve mood parametreleri zorunludur" 
      });
    }

    // Şehir adını normalize et
    const normalizedCity = normalizeCity(city);

    // Duygu → OSM kategorileri
    const categories = emotionCategoryMap[mood];
    if (!categories) {
      return res.status(400).json({ 
        success: false,
        error: "Geçersiz mood değeri" 
      });
    }

    // Şehir koordinatı bulma - önce lookup tablosundan, yoksa Nominatim'den
    let cityLat, cityLon;
    
    // Önce lookup tablosundan kontrol et
    if (cityCoords[normalizedCity]) {
      cityLat = cityCoords[normalizedCity].lat;
      cityLon = cityCoords[normalizedCity].lon;
      console.log(`✅ Şehir koordinatı lookup tablosundan alındı: ${normalizedCity}`);
    } else {
      // Lookup tablosunda yoksa Nominatim'den al
      try {
        const nominatimRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
          {
            headers: {
              'User-Agent': 'MindRoute/1.0'
            }
          }
        );
        const nominatimData = await nominatimRes.json();
        
        if (nominatimData.length > 0) {
          cityLat = parseFloat(nominatimData[0].lat);
          cityLon = parseFloat(nominatimData[0].lon);
          console.log(`✅ Şehir koordinatı Nominatim'den alındı: ${city}`);
        } else {
          // Fallback: İstanbul koordinatları
          cityLat = cityCoords["istanbul"].lat;
          cityLon = cityCoords["istanbul"].lon;
          console.log(`⚠️ Şehir bulunamadı, İstanbul koordinatları kullanılıyor: ${city}`);
        }
      } catch (err) {
        console.error("Nominatim error:", err);
        // Fallback: İstanbul koordinatları
        cityLat = cityCoords["istanbul"].lat;
        cityLon = cityCoords["istanbul"].lon;
        console.log(`⚠️ Nominatim hatası, İstanbul koordinatları kullanılıyor: ${city}`);
      }
    }

    // Overpass API query - şehir merkezine yakın mekanlar (bbox kullanarak)
    // Normalize edilmiş şehir adıyla area sorgusu da denenebilir ama bbox daha güvenilir
    const bbox = `${cityLat - 0.1},${cityLon - 0.1},${cityLat + 0.1},${cityLon + 0.1}`;
    const query = `
[out:json][timeout:25];
(
  ${categories.map((tag) => `${tag}(bbox:${bbox});`).join("\n  ")}
);
out center;
`;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "data=" + encodeURIComponent(query)
    });

    // XML kontrolü - Overpass rate-limit veya hata durumunda XML döner
    const rawText = await response.text();
    
    // Eğer XML hata mesajı geldiyse:
    if (rawText.trim().startsWith("<")) {
      console.log("❌ Overpass XML döndürdü → rate limit veya server error");
      return res.json({ 
        success: true,
        count: 0, 
        places: [] 
      });
    }

    // JSON'a çevir (artık güvenli)
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.log("❌ JSON Parse Hatası:", err);
      return res.json({ 
        success: true,
        count: 0, 
        places: [] 
      });
    }

    // Overpass sonuçları kontrol
    if (!data.elements || data.elements.length === 0) {
      return res.json({ 
        success: true,
        count: 0, 
        places: [] 
      });
    }

    // En az 3 mekan garantisi için filtreleme ve sıralama
    let places = data.elements
      .map((p) => ({
        id: p.id,
        name: p.tags?.name || "İsimsiz Mekan",
        type: p.tags?.amenity || p.tags?.leisure || p.tags?.tourism || "unknown",
        lat: p.lat || p.center?.lat,
        lon: p.lon || p.center?.lon,
      }))
      .filter((p) => p.name !== "İsimsiz Mekan" && p.lat && p.lon);

    // Şehir merkezine yakınlığa göre sırala
    places = places
      .map((p) => {
        const distance = Math.sqrt(
          Math.pow(p.lat - cityLat, 2) + Math.pow(p.lon - cityLon, 2)
        );
        return { ...p, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...p }) => p);

    // En az 3 mekan garantisi
    if (places.length < 3) {
      // Eğer yeterli mekan yoksa, bbox ile daha geniş alan ara
      const widerBbox = `${cityLat - 0.2},${cityLon - 0.2},${cityLat + 0.2},${cityLon + 0.2}`;
      const widerQuery = `
[out:json][timeout:25];
(
  ${categories.map((tag) => `${tag}(bbox:${widerBbox});`).join("\n  ")}
);
out center;
`;

      const widerResponse = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "data=" + encodeURIComponent(widerQuery)
      });

      // XML kontrolü - genişletilmiş sorgu için de
      const widerRawText = await widerResponse.text();
      
      let widerData = { elements: [] };
      
      // Eğer XML değilse JSON parse et
      if (!widerRawText.trim().startsWith("<")) {
        try {
          widerData = JSON.parse(widerRawText);
        } catch (err) {
          console.log("❌ Genişletilmiş sorgu JSON Parse Hatası:", err);
          widerData = { elements: [] };
        }
      } else {
        console.log("❌ Genişletilmiş sorgu XML döndürdü → rate limit");
      }
      const widerPlaces = (widerData.elements || [])
        .map((p) => ({
          id: p.id,
          name: p.tags?.name || "İsimsiz Mekan",
          type: p.tags?.amenity || p.tags?.leisure || p.tags?.tourism || "unknown",
          lat: p.lat || p.center?.lat,
          lon: p.lon || p.center?.lon,
        }))
        .filter((p) => p.name !== "İsimsiz Mekan" && p.lat && p.lon)
        .map((p) => {
          const distance = Math.sqrt(
            Math.pow(p.lat - cityLat, 2) + Math.pow(p.lon - cityLon, 2)
          );
          return { ...p, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .map(({ distance, ...p }) => p);

      // Mevcut mekanlarla birleştir ve tekrarları kaldır
      const allPlaces = [...new Map([...places, ...widerPlaces].map(p => [p.id, p])).values()];
      places = allPlaces.slice(0, 10);
    }

    return res.json({
      success: true,
      count: places.length,
      places: places.slice(0, 10), // En fazla 10 mekan döndür
    });
  } catch (err) {
    console.error("API suggest error:", err);
    // Hata durumunda bile boş array döndür, frontend çökmesin
    return res.json({ 
      success: true,
      count: 0, 
      places: [] 
    });
  }
});

// MiniAssistant şu anda /api/mood-text kullanıyor

app.listen(process.env.PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${process.env.PORT}`);
});

