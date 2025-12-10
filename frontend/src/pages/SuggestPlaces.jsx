import { useState } from "react";

export default function SuggestPlaces() {
  const [city, setCity] = useState("");

  return (
    <div className="suggest-bg min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white/60 p-6 rounded-xl shadow-lg w-full max-w-md backdrop-blur">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Mekan Önerisi Al
        </h1>

        <label className="font-medium">Şehir Seç:</label>
        <input
          type="text"
          placeholder="Örn: İstanbul"
          className="w-full p-2 border rounded mt-2 mb-4"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Önerileri Getir
        </button>
      </div>
    </div>
  );
}

