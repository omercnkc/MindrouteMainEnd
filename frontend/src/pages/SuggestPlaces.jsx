import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SuggestPlaces.css";

export default function SuggestPlaces() {
  const navigate = useNavigate();
  const location = useLocation();

  const mood = location.state?.mood || location.state?.emotion || "unknown";

  const [city, setCity] = useState("");
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Şehir adını normalize et
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

  const getSuggestions = async () => {
    if (!city.trim()) return;
    setLoading(true);

    try {
      const normalizedCity = normalizeCity(city);
      const response = await fetch(
        `http://localhost:3000/api/suggest?city=${encodeURIComponent(normalizedCity)}&mood=${encodeURIComponent(mood)}`
      );

      const data = await response.json();

      if (data.success && data.places && data.places.length > 0) {
        setPlaces(data.places);
        setCurrentIndex(0);
      } else {
        setPlaces([]);
        alert(data.error || "Mekan bulunamadı");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }

    setLoading(false);
  };

  const nextPlace = () => {
    if (places.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % places.length);
  };

  const currentPlace = places[currentIndex];

  return (
    <div className="suggest-bg">
      {/* Geri tuşu */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Geri"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: "20px", height: "20px" }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Cam blur kutusu */}
      <div className="glass-panel">
        <h2>Duygun: {mood}</h2>

        <label>Şehir Seç:</label>
        <input
          type="text"
          placeholder="Örn: İstanbul"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              getSuggestions();
            }
          }}
        />

        <button onClick={getSuggestions} className="suggest-btn" disabled={loading}>
          {loading ? "Yükleniyor..." : "Önerileri Getir"}
        </button>

        {/* Mekan kartı */}
        {loading && <p style={{ marginTop: "20px" }}>Mekanlar yükleniyor…</p>}

        {!loading && places.length === 0 && city && (
          <p style={{ marginTop: "20px", opacity: 0.8 }}>
            Mekan önerileri burada görünecek…
          </p>
        )}

        {!loading && currentPlace && (
          <div className="place-card">
            <h3>{currentPlace.name || "İsimsiz Mekan"}</h3>
            <p>
              <strong>Tür:</strong> {currentPlace.type || "Bilinmiyor"}
            </p>

            <button
              className="map-btn"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${currentPlace.lat},${currentPlace.lon}`,
                  "_blank"
                )
              }
            >
              Haritada Aç
            </button>

            {places.length > 1 && (
              <button className="next-btn" onClick={nextPlace}>
                Sonraki Mekan → ({currentIndex + 1}/{places.length})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
