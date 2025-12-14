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
//  MEKAN İSMİ ZORLA TÜRKÇELEŞTİRME FONKSİYONU
// ===================================
function forceTurkishName(place) {
  const original = place.name || "";

  // Arapça karakter kontrolü
  const isArabic = /[\u0600-\u06FF]/.test(original);

  if (!original || isArabic) {
    // Kategoriden Türkçe isim üret
    const type = place.type || place.types?.[0] || "";
    const lower = type.toLowerCase();

    if (lower.includes("library") || lower.includes("kütüphane")) return "Kütüphane";
    if (lower.includes("cafe") || lower.includes("kafe")) return "Kafe";
    if (lower.includes("restaurant") || lower.includes("restoran")) return "Restoran";
    if (lower.includes("park") || lower.includes("park")) return "Park";
    if (lower.includes("store") || lower.includes("shop") || lower.includes("mağaza")) return "Mağaza";
    if (lower.includes("supermarket") || lower.includes("market")) return "Market";
    if (lower.includes("museum") || lower.includes("müze")) return "Müze";
    if (lower.includes("school") || lower.includes("okul")) return "Okul";
    if (lower.includes("bar") || lower.includes("pub")) return "Bar";
    if (lower.includes("garden") || lower.includes("bahçe")) return "Bahçe";
    if (lower.includes("gallery") || lower.includes("galeri")) return "Galeri";
    if (lower.includes("mosque") || lower.includes("cami")) return "Cami";
    if (lower.includes("hospital") || lower.includes("hastane")) return "Hastane";
    if (lower.includes("pharmacy") || lower.includes("eczane")) return "Eczane";

    return "Mekan"; // fallback
  }

  // İngilizce → Türkçe düzeltmesi
  return original
    .replace(/Library/i, "Kütüphane")
    .replace(/Cafe|Coffee/i, "Kafe")
    .replace(/Restaurant/i, "Restoran")
    .replace(/Market/i, "Market");
}

// ===================================
//  ŞEHİR KOORDİNATI BULMA (Nominatim)
// ===================================
async function getCityCoordinates(city) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=tr`;
    const res = await fetch(url, { 
      headers: { 
        "User-Agent": "MindRoute/1.0"
      }
    });
    const data = await res.json();

    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (err) {
    console.error("getCityCoordinates error:", err);
    return null;
  }
}

// ===================================
//  GOOGLE PLACES API HELPER FONKSİYONLARI
// ===================================

// Şehri koordinata çevir (Geocoding API)
async function getCityLocation(city) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.log("⚠️ Google Places API key bulunamadı, Geocoding atlanıyor");
    return null;
  }

  try {
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&language=tr&key=${apiKey}`;
    const response = await fetch(geoUrl);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return data.results[0].geometry.location; // { lat, lng }
  } catch (err) {
    console.error("Google Geocoding error:", err);
    return null;
  }
}

// Duyguya göre Google Places keyword belirle
function getGooglePlacesKeyword(mood) {
  const moodKeywords = {
    happy: "cafe restaurant bar",
    sad: "park garden nature",
    anxious: "park library museum",
    angry: "park nature reserve",
    tired: "cafe restaurant",
    lonely: "cafe pub community center",
    unsure: "museum gallery library"
  };
  return moodKeywords[mood] || "cafe restaurant";
}

// Genel mekan arama fonksiyonu (keyword ile)
async function fetchPlaces(lat, lon, keyword) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log("⚠️ Google Places API key bulunamadı");
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=60000&keyword=${encodeURIComponent(keyword)}&language=tr&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchPlaces error:", err);
    return [];
  }
}

// OSM'den Türkçe isim getiren fonksiyon
async function getNameFromOSM(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&accept-language=tr`;
    const res = await fetch(url, { 
      headers: { 
        "User-Agent": "MindRoute/1.0"
      }
    });
    const data = await res.json();
    return data?.name || null;
  } catch (err) {
    console.error("getNameFromOSM error:", err);
    return null;
  }
}

// Koordinata göre mekan ara (Nearby Search) - Eski versiyon (mood bazlı)
async function searchNearbyPlaces(lat, lng, mood) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.log("⚠️ Google Places API key bulunamadı, Nearby Search atlanıyor");
    return [];
  }

  try {
    // Önce turistik yerler ara
    let results = await fetchPlaces(lat, lng, "tourist attraction");

    // Eğer çok az ise fallback kategoriler
    if (results.length < 5) {
      const fallbackKeywords = [
        "point_of_interest",
        "museum",
        "historical site",
        "landmark",
        "sightseeing",
        "castle",
        "kale",
        "şelale",
        "göl",
        "plaj",
        "park",
        "cafe",
        "restaurant"
      ];

      for (const word of fallbackKeywords) {
        const extra = await fetchPlaces(lat, lng, word);
        results = [...results, ...extra];
        if (results.length >= 10) break;
      }
    }

    // Türkçe isim düzeltme ve formatlama
    const finalResults = [];
    for (const place of results.slice(0, 15)) {
      let name = place.name || "";

      // Arapça / Farsça isim kontrolü
      const isForeign = /[\u0600-\u06FF]/.test(name);

      if (isForeign || !name) {
        const fixed = await getNameFromOSM(
          place.geometry?.location?.lat,
          place.geometry?.location?.lng
        );
        if (fixed) {
          name = fixed;
        }
      }

      // Türkçeleştirme
      name = forceTurkishName({ 
        name: name, 
        type: place.types?.[0], 
        types: place.types 
      });

      finalResults.push({
        id: place.place_id,
        name: name,
        type: place.types?.[0] || "establishment",
        lat: place.geometry?.location?.lat,
        lon: place.geometry?.location?.lng,
        rating: place.rating,
        address: place.vicinity
      });
    }

    return finalResults;
  } catch (err) {
    console.error("Google Places Nearby Search error:", err);
    return [];
  }
}

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
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=tr`,
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
    const bbox = `bbox:${cityLat - 0.1},${cityLon - 0.1},${cityLat + 0.1},${cityLon + 0.1}`;
    // emotionCategoryMap formatını Overpass query formatına çevir
    const overpassFilters = categories.map(tag => {
      // node[amenity=cafe] → node[amenity="cafe"](bbox:...)
      const match = tag.match(/^(node|way|relation)\[([^=]+)=([^\]]+)\]/);
      if (match) {
        const [, type, key, value] = match;
        return `${type}["${key}"="${value}"](${bbox});`;
      }
      return tag;
    }).join('\n  ');
    
    const query = `
[out:json][timeout:25];
(
  ${overpassFilters}
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
      places: data.elements.map((p) => {
        const type = p.tags?.amenity || p.tags?.leisure || p.tags?.tourism || "unknown";
        return {
        id: p.id,
          name: forceTurkishName({ name: p.tags?.name || "", type: type }),
          type: type,
        lat: p.lat || p.center?.lat,
        lon: p.lon || p.center?.lon,
        };
      }),
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
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=tr`,
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
    const bbox = `bbox:${cityLat - 0.1},${cityLon - 0.1},${cityLat + 0.1},${cityLon + 0.1}`;
    // emotionCategoryMap formatını Overpass query formatına çevir
    const overpassFilters = categories.map(tag => {
      // node[amenity=cafe] → node[amenity="cafe"](bbox:...)
      const match = tag.match(/^(node|way|relation)\[([^=]+)=([^\]]+)\]/);
      if (match) {
        const [, type, key, value] = match;
        return `${type}["${key}"="${value}"](${bbox});`;
      }
      return tag;
    }).join('\n  ');
    
    const query = `
[out:json][timeout:25];
(
  ${overpassFilters}
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
      // Overpass'ten sonuç yoksa Google Places API'ye fallback yap (turistik yerler stratejisi ile)
      console.log("⚠️ Overpass'ten sonuç gelmedi, Google Places API (turistik yerler) deneniyor...");
      const googlePlaces = await searchNearbyPlaces(cityLat, cityLon, mood);
      
      if (googlePlaces.length > 0) {
        console.log(`✅ Google Places API'den ${googlePlaces.length} mekan bulundu (turistik yerler + fallback)`);
        return res.json({
          success: true,
          count: googlePlaces.length,
          places: googlePlaces.slice(0, 10),
        });
      }
      
      return res.json({ 
        success: true,
        count: 0, 
        places: [] 
      });
    }

    // En az 3 mekan garantisi için filtreleme ve sıralama
    let places = data.elements
      .map((p) => {
        const type = p.tags?.amenity || p.tags?.leisure || p.tags?.tourism || "unknown";
        return {
          id: p.id,
          name: forceTurkishName({ name: p.tags?.name || "", type: type }),
          type: type,
          lat: p.lat || p.center?.lat,
          lon: p.lon || p.center?.lon,
        };
      })
      .filter((p) => p.name && p.name !== "Mekan" && p.lat && p.lon);

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
      const widerBbox = `bbox:${cityLat - 0.2},${cityLon - 0.2},${cityLat + 0.2},${cityLon + 0.2}`;
      // emotionCategoryMap formatını Overpass query formatına çevir
      const widerOverpassFilters = categories.map(tag => {
        // node[amenity=cafe] → node[amenity="cafe"](bbox:...)
        const match = tag.match(/^(node|way|relation)\[([^=]+)=([^\]]+)\]/);
        if (match) {
          const [, type, key, value] = match;
          return `${type}["${key}"="${value}"](${widerBbox});`;
        }
        return tag;
      }).join('\n  ');
      
      const widerQuery = `
[out:json][timeout:25];
(
  ${widerOverpassFilters}
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
        .map((p) => {
          const type = p.tags?.amenity || p.tags?.leisure || p.tags?.tourism || "unknown";
          return {
            id: p.id,
            name: forceTurkishName({ name: p.tags?.name || "", type: type }),
            type: type,
            lat: p.lat || p.center?.lat,
            lon: p.lon || p.center?.lon,
          };
        })
        .filter((p) => p.name && p.name !== "Mekan" && p.lat && p.lon)
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

    // Eğer hala yeterli mekan yoksa, Google Places API'ye fallback yap
    // Küçük şehirler için direkt Google Places API kullan (turistik yerler için)
    if (places.length < 3) {
      console.log(`⚠️ Overpass'ten yeterli mekan bulunamadı (${places.length}), Google Places API (turistik yerler) deneniyor...`);
      
      // Google Places API ile turistik yerler + fallback kategorilerle arama yap
      const googlePlaces = await searchNearbyPlaces(cityLat, cityLon, mood);
      
      if (googlePlaces.length > 0) {
        console.log(`✅ Google Places API'den ${googlePlaces.length} mekan bulundu (turistik yerler + fallback)`);
        // Google Places sonuçlarını mevcut sonuçlarla birleştir
        const combinedPlaces = [...new Map([...places, ...googlePlaces].map(p => [p.id || p.name, p])).values()];
        places = combinedPlaces.slice(0, 10);
      } else {
        console.log("⚠️ Google Places API'den de sonuç bulunamadı");
      }
    }

    // Tüm mekan isimlerini zorla Türkçeleştir (son kontrol)
    places = places.map(p => ({
      ...p,
      name: forceTurkishName(p)
    }));

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

// ===================================
//  OSM TAG → OVERPASS FORMAT ÇEVİRİCİ
// ===================================
function buildOverpassBlock(tag, bbox) {
  // "historic=castle" → ["historic", "castle"]
  const [key, value] = tag.split("=");
  
  return `
    node["${key}"="${value}"](${bbox});
    way["${key}"="${value}"](${bbox});
    relation["${key}"="${value}"](${bbox});
  `;
}

// ===================================
//  DUYGUYA GÖRE OSM TAG EŞLEŞMELERİ
// ===================================
const moodCategories = {
  happy: ['tourism=attraction'],
  
  sad: [
    "tourism=attraction",
    "tourism=viewpoint",
    "historic=castle",
    "historic=fort",
    "historic=ruins",
    "natural=water",
    "natural=lake",
    "natural=bay",
    "natural=peak"
  ],

  angry: ['leisure=park', 'leisure=nature_reserve'],

  lonely: ['amenity=cafe', 'amenity=restaurant'],

  neutral: ['tourism=attraction'],

  anxious: ['leisure=park', 'amenity=library', 'tourism=museum'],

  tired: ['amenity=cafe', 'amenity=restaurant'],

  unsure: ['tourism=museum', 'tourism=gallery', 'amenity=library']
};

// ===================================
//  TURİSTİK YERLER ENDPOINTİ (/api/places)
// ===================================
app.get("/api/places", async (req, res) => {
  try {
    const { city, mood } = req.query;

    if (!city) {
      return res.json({ success: false, message: "Şehir belirtilmedi" });
    }

    console.log("GELEN MOOD:", mood);

    // 1) Şehir koordinatı al
    const coords = await getCityCoordinates(city);
    if (!coords) {
      return res.json({ success: false, count: 0, places: [] });
    }

    const { lat, lon } = coords;

    // 2) Duygu → OSM tag eşleşmesi
    const selectedTags = moodCategories[mood] || moodCategories["neutral"];

    console.log("SEÇİLEN OSM TAG'LER:", selectedTags);

    // 3) Overpass API ile OSM tag'lerine göre arama
    const bbox = `bbox:${lat - 0.1},${lon - 0.1},${lat + 0.1},${lon + 0.1}`;
    
    // OSM tag'lerini Overpass query formatına çevir (node, way, relation için)
    const overpassFilters = selectedTags.map(tag => buildOverpassBlock(tag, bbox)).join('\n');

    const query = `
[out:json][timeout:25];
(
  ${overpassFilters}
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

    // XML kontrolü
    const rawText = await response.text();
    
    if (rawText.trim().startsWith("<")) {
      console.log("❌ Overpass XML döndürdü → rate limit veya server error");
      return res.json({ 
        success: true,
        count: 0, 
        places: [] 
      });
    }

    // JSON'a çevir
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

    // Overpass sonuçlarını işle
    let results = (data.elements || [])
      .map((p) => {
        const type = p.tags?.tourism || p.tags?.historic || p.tags?.natural || p.tags?.leisure || p.tags?.amenity || "unknown";
        return {
          id: p.id,
          name: p.tags?.name || "",
          type: type,
          lat: p.lat || p.center?.lat,
          lon: p.lon || p.center?.lon,
        };
      })
      .filter((p) => p.name && p.lat && p.lon);

    // Şehir merkezine yakınlığa göre sırala
    results = results
      .map((p) => {
        const distance = Math.sqrt(
          Math.pow(p.lat - lat, 2) + Math.pow(p.lon - lon, 2)
        );
        return { ...p, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...p }) => p);

    // 4) Arapça / Çince / diğer dilleri ayıkla ve Türkçeleştir
    const finalResults = [];
    for (const place of results.slice(0, 10)) {
      let name = place.name || "";

      // Arapça karakter kontrolü
      const isArabic = /[\u0600-\u06FF]/.test(name);
      const isNonTurkish = !/^[A-Za-zığüşöçİĞÜŞÖÇ0-9\s\-.,()]+$/.test(name);

      if (isArabic || isNonTurkish || !name) {
        const fixed = await getNameFromOSM(place.lat, place.lon);
        if (fixed) {
          name = fixed;
        }
      }

      // Türkçeleştirme fonksiyonu ile işle
      name = forceTurkishName({ 
        name: name, 
        type: place.type
      });

      // Sadece Türkçe karakter içeren isimleri kabul et
      if (/^[A-Za-zığüşöçİĞÜŞÖÇ0-9\s\-.,()]+$/.test(name)) {
        finalResults.push({
          name: name,
          lat: place.lat,
          lon: place.lon,
          type: place.type
        });
      }
    }

    return res.json({
      success: true,
      count: finalResults.length,
      places: finalResults
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.json({ success: false, message: "Sunucu hatası" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${process.env.PORT}`);
});

