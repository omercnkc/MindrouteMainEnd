import React, { useState } from "react";
import solAltLeaf from "./assets/solalt.svg";
import solUstLeaf from "./assets/solust.svg";
import sagAltLeaf from "./assets/sagalt.svg";
import sagUstLeaf from "./assets/sagust.svg";
import ustOrtaLeaf from "./assets/ustorta.svg";
import arkaPlan2 from "./assets/arkaplan2.png";
import "./index.css";

export default function App() {
  const [showVideoPage, setShowVideoPage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzedMood, setAnalyzedMood] = useState(null);
  const [showMoodConfirmation, setShowMoodConfirmation] = useState(false);
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [showUserMoodConfirmation, setShowUserMoodConfirmation] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [userMoodDescription, setUserMoodDescription] = useState("");

  // 🎥 2. Sayfa: Video yükleme ekranı
  if (showVideoPage) {
    // Mekan önerme sayfası
    if (showPlaces) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${arkaPlan2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              setShowPlaces(false);
              setShowMoodConfirmation(false);
              setShowUserMoodConfirmation(false);
              setShowMoodInput(false);
              setAnalyzedMood(null);
              setUserMoodDescription("");
            }}
            style={{
              position: "absolute",
              top: "32px",
              left: "32px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              maxWidth: "600px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "24px",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Senin İçin Önerilen Mekanlar
            </h2>
            <p style={{ color: "#fff", fontSize: "18px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Ruh haline göre mekanlar yükleniyor...
            </p>
          </div>
        </div>
      );
    }

    // Kullanıcının yazdığı ruh halini gösteren sayfa
    if (showUserMoodConfirmation && userMoodDescription) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${arkaPlan2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              setShowUserMoodConfirmation(false);
              setShowMoodInput(true);
            }}
            style={{
              position: "absolute",
              top: "32px",
              left: "32px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              maxWidth: "600px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "24px",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Yani şu anda kendini şöyle hissediyorsun:
            </h2>
            <p
              style={{
                fontSize: "20px",
                color: "#fff",
                marginBottom: "32px",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                fontStyle: "italic",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              "{userMoodDescription}"
            </p>
            <button
              onClick={() => {
                setShowPlaces(true);
                setShowUserMoodConfirmation(false);
              }}
              style={{
                padding: "12px 32px",
                backgroundColor: "#f97316",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.2s, transform 0.2s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ea580c";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f97316";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Devam Et
            </button>
          </div>
        </div>
      );
    }

    // Ruh hali açıklama sayfası
    if (showMoodInput) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${arkaPlan2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              setShowMoodInput(false);
              setShowMoodConfirmation(true);
            }}
            style={{
              position: "absolute",
              top: "32px",
              left: "32px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              maxWidth: "600px",
              width: "90%",
              textAlign: "left",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "16px",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Ruh Halini Açıkla
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#fff",
                marginBottom: "24px",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              Nasıl hissediyorsun? Ruh halini detaylı bir şekilde anlat.
            </p>
            <textarea
              value={userMoodDescription}
              onChange={(e) => setUserMoodDescription(e.target.value)}
              placeholder="Örneğin: Bugün çok mutluyum, enerjik hissediyorum ve açık havada vakit geçirmek istiyorum..."
              style={{
                width: "100%",
                minHeight: "150px",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "16px",
                marginBottom: "24px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                if (userMoodDescription.trim()) {
                  setShowUserMoodConfirmation(true);
                  setShowMoodInput(false);
                }
              }}
              style={{
                padding: "12px 32px",
                backgroundColor: "#f97316",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.2s, transform 0.2s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ea580c";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f97316";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Gönder
            </button>
          </div>
        </div>
      );
    }

    // Ruh hali doğrulama sayfası
    if (showMoodConfirmation && analyzedMood) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: `url(${arkaPlan2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              setShowMoodConfirmation(false);
              setAnalyzedMood(null);
              setSelectedFile(null);
            }}
            style={{
              position: "absolute",
              top: "32px",
              left: "32px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              maxWidth: "600px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "24px",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              Ruh hali: {analyzedMood}
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#fff",
                marginBottom: "32px",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              Bu doğru mu?
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setShowPlaces(true);
                  setShowMoodConfirmation(false);
                }}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#10b981",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#059669";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#10b981";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Evet
              </button>
              <button
                onClick={() => {
                  setShowMoodInput(true);
                  setShowMoodConfirmation(false);
                }}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      );
    }
  return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${arkaPlan2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Geri dön ok butonu */}
        <button
          onClick={() => {
            setShowVideoPage(false);
            setSelectedFile(null);
            setAnalyzedMood(null);
            setShowMoodConfirmation(false);
            setShowMoodInput(false);
            setShowUserMoodConfirmation(false);
            setShowPlaces(false);
            setUserMoodDescription("");
          }}
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            maxWidth: "600px",
            width: "90%",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "16px",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Duygularına Göre Şehirde Yolculuk Et
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#fff",
              marginBottom: "32px",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            10 saniyelik bir video yükle, ruh hâlini analiz edelim 🌙
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <label
              htmlFor="video-upload"
              style={{
                padding: "12px 24px",
                backgroundColor: "#f97316",
                color: "white",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
                border: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ea580c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f97316";
              }}
            >
              Dosya Seç
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
              }}
            />
            <span style={{ color: "#fff", fontSize: "14px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {selectedFile ? selectedFile.name : "Dosya seçilmedi"}
            </span>
          </div>
          {selectedFile && (
            <button
              onClick={() => {
                // Burada video analizi yapılacak
                // Şimdilik örnek bir ruh hali gösteriyoruz
                const moods = ["Mutlu", "Hüzünlü", "Enerjik", "Sakin", "Heyecanlı", "Yorgun"];
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                setAnalyzedMood(randomMood);
                setShowMoodConfirmation(true);
              }}
              style={{
                padding: "12px 32px",
                backgroundColor: "#f97316",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.2s, transform 0.2s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ea580c";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f97316";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Analiz Et
            </button>
          )}
        </div>
      </div>
    );
  }

  // 🌿 1. Sayfa: Yapraklı giriş
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/anasayfa1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.10)", zIndex: 1 }}></div>

      {/* Yapraklar */}
      <img src={solAltLeaf} alt="Sol alt yaprak" className="leaf" style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "420px", opacity: 0.95, pointerEvents: "none", zIndex: 2 }} />
      <img src={solUstLeaf} alt="Sol üst yaprak" className="leaf" style={{ position: "absolute", top: "-140px", left: "-60px", width: "800px", opacity: 0.95, pointerEvents: "none", zIndex: 2 }} />
      <img src={sagAltLeaf} alt="Sağ alt yaprak" className="leaf" style={{ position: "absolute", bottom: "-35px", right: "-260px", width: "1250px", opacity: 0.95, pointerEvents: "none", zIndex: 2 }} />
      <img src={sagUstLeaf} alt="Sağ üst yaprak" className="leaf" style={{ position: "absolute", top: "-180px", right: "-40px", width: "650px", opacity: 0.95, pointerEvents: "none", zIndex: 2 }} />
      <img src={ustOrtaLeaf} alt="Üst orta yaprak" className="leaf-center" style={{ position: "absolute", top: "-40px", left: "42%", width: "1700px", opacity: 0.95, pointerEvents: "none", zIndex: 2 }} />

      {/* Alt ortadaki cam efektli kart + buton */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "6%",
          transform: "translateX(-50%)",
          padding: "18px 32px 24px",
          borderRadius: "28px",
          background: "rgba(0, 0, 0, 0.18)",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "#ffecb3",
            fontSize: "20px",
            fontWeight: 700,
            textShadow: "0 3px 8px rgba(0,0,0,0.8)",
          }}
        >
          Ruh hâline göre rotanı başlat
        </div>
        <button
          onClick={() => setShowVideoPage(true)}
          style={{
            padding: "14px 48px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.03em",
            color: "#fff7e6",
            backgroundImage: "linear-gradient(135deg, #ffb347, #ff5f6d)",
            boxShadow: "0 10px 0 #b23c00, 0 18px 40px rgba(0,0,0,0.8)",
            textTransform: "uppercase",
            transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(2px)";
            e.currentTarget.style.boxShadow = "0 6px 0 #b23c00, 0 12px 30px rgba(0,0,0,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 0 #b23c00, 0 18px 40px rgba(0,0,0,0.8)";
          }}
        >
          Başla
        </button>
      </div>
    </div>
  );
}
