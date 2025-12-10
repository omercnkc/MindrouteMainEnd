import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import solAltLeaf from "./assets/solalt.svg";
import solUstLeaf from "./assets/solust.svg";
import sagAltLeaf from "./assets/sagalt.svg";
import sagUstLeaf from "./assets/sagust.svg";
import ustOrtaLeaf from "./assets/ustorta.svg";
import arkaPlan2 from "./assets/arkaplan2.png";
import SuggestPlaces from "./pages/SuggestPlaces";
import "./index.css";
import "./App.css";

function HomePage() {
  const navigate = useNavigate();
  const [showVideoPage, setShowVideoPage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzedMood, setAnalyzedMood] = useState(null);
  const [showMoodConfirmation, setShowMoodConfirmation] = useState(false);
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [userMoodDescription, setUserMoodDescription] = useState("");
  const [aiMoodLabel, setAiMoodLabel] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const detectMoodFallback = (text) => {
    const moodMap = {
      yalnız: "derin yalnızlık",
      üzgün: "yoğun üzüntü",
      mutlu: "neşeli ve enerjik",
      kaygı: "hafif kaygı",
      yorgun: "yoğun yorgunluk",
      öldürmek: "yoğun umutsuzluk",
      hiçbir: "tükenmişlik",
      içimden: "enerji eksikliği",
    };
    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(moodMap)) {
      if (lowerText.includes(key)) {
        return value;
      }
    }
    return "karmaşık duygular";
  };

  const sendMessageToAssistant = async (text) => {
    const messageToSend = text.trim();
    if (!messageToSend || isLoadingAI) return;

    setIsLoadingAI(true);
    let moodLabel = "";
    let reply = "";

    try {
      const res = await fetch("/api/mood-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          history: chatHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        moodLabel = data.emotion || data.mood_label || "";
        reply =
          data.reply ||
          "Yazdıklarını okudum ve seni anlıyorum. Birlikte senin için uygun mekanları bulalım.";
      } else {
        moodLabel = detectMoodFallback(messageToSend);
        reply =
          "Yazdıklarını okudum ve seni anlıyorum. Şu an teknik bir sorun yaşıyorum ama seni dinliyorum.";
      }
    } catch (error) {
      console.error("AI chat error:", error);
      moodLabel = detectMoodFallback(messageToSend);
      reply =
        "Şu an teknik bir sorun yaşıyorum ama yazdıkların benim için önemli. Birazdan tekrar dener misin?";
    } finally {
      const safeMood = moodLabel || detectMoodFallback(messageToSend);
      const safeReply =
        reply ||
        "Şu an teknik bir sorun yaşıyorum ama yazdıkların benim için önemli. Birazdan tekrar dener misin?";

      setAiMoodLabel(safeMood);
      setAiReply(safeReply);
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: messageToSend },
        { role: "assistant", content: safeReply },
      ]);
      setIsLoadingAI(false);
      setShowAIChat(true);
      setShowMoodInput(false);
      setChatInput("");
    }
  };

  const handleCustomMoodSubmit = async (e) => {
    e.preventDefault();
    await sendMessageToAssistant(userMoodDescription);
  };

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
              setShowAIChat(false);
              setShowMoodInput(false);
              setAnalyzedMood(null);
              setUserMoodDescription("");
              setAiMoodLabel("");
              setAiReply("");
              setChatHistory([]);
              setChatInput("");
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
            <p
              style={{
                color: "#fff",
                fontSize: "18px",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                marginBottom: "32px",
              }}
            >
              {aiMoodLabel
                ? `\"${aiMoodLabel}\" ruh hâline uygun mekan önerileri:`
                : userMoodDescription
                ? `\"${userMoodDescription}\" hislerine göre mekan önerileri:`
                : analyzedMood
                ? `\"${analyzedMood}\" ruh hâline uygun mekan önerileri:`
                : "Ruh hâline göre mekan önerileri yakında burada."}
            </p>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "24px",
                fontSize: "18px",
                textAlign: "center",
                minHeight: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed rgba(255,255,255,0.3)",
              }}
            >
              Mekan önerileri yakında burada olacak!
            </div>
          </div>
        </div>
      );
    }

    // AI destekli sohbet ekranı
    if (showAIChat && aiMoodLabel && aiReply) {
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
              setShowAIChat(false);
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
              maxWidth: "700px",
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: "12px",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                Şu anda kendini şöyle hissettiğini anlıyorum:
              </h2>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#ffecb3",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {aiMoodLabel}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxHeight: "340px",
                overflowY: "auto",
                paddingRight: "6px",
              }}
            >
              {chatHistory.map((item, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  style={{
                    alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "82%",
                    backgroundColor:
                      item.role === "user"
                        ? "rgba(249, 115, 22, 0.3)"
                        : "rgba(255, 255, 255, 0.15)",
                    borderRadius:
                      item.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    padding: "14px 16px",
                    border:
                      item.role === "user"
                        ? "1px solid rgba(249,115,22,0.4)"
                        : "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    lineHeight: 1.5,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.content}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageToAssistant(chatInput || userMoodDescription);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="İstersen devam et: Bugün içinden neler geçiyor?"
                style={{
                  width: "100%",
                  minHeight: "96px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  fontSize: "15px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                disabled={isLoadingAI}
              />
              <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  disabled={isLoadingAI || !chatInput.trim()}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isLoadingAI ? "#94a3b8" : "#f97316",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "12px",
                    border: "none",
                    cursor:
                      isLoadingAI || !chatInput.trim() ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    transition: "background-color 0.2s, transform 0.2s",
                    flex: 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoadingAI && chatInput.trim()) {
                      e.currentTarget.style.backgroundColor = "#ea580c";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isLoadingAI
                      ? "#94a3b8"
                      : "#f97316";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {isLoadingAI ? "AI yazıyor..." : "Gönder"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/suggest");
                  }}
                  style={{
                    padding: "12px 24px",
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
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Mekan Öner
                </button>
              </div>
            </form>

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
              {analyzedMood
                ? "Video tahmini doğru değilse, ruh hâlini bize yazarak anlat; yazdıklarından sohbet sırasında yeniden tespit edelim."
                : "Ruh hâlini yazıyla paylaş; sohbet ederken seni dinleyip ruh hâlini tekrar tespit edelim."}
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
              onClick={handleCustomMoodSubmit}
              disabled={isLoadingAI || !userMoodDescription.trim()}
              style={{
                padding: "12px 32px",
                backgroundColor: isLoadingAI ? "#94a3b8" : "#f97316",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                border: "none",
                cursor:
                  isLoadingAI || !userMoodDescription.trim()
                    ? "not-allowed"
                    : "pointer",
                fontSize: "16px",
                transition: "background-color 0.2s, transform 0.2s",
                width: "100%",
                opacity: isLoadingAI ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoadingAI && userMoodDescription.trim()) {
                  e.currentTarget.style.backgroundColor = "#ea580c";
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isLoadingAI
                  ? "#94a3b8"
                  : "#f97316";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isLoadingAI ? "AI analiz ediyor..." : "Gönder"}
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
                  setChatHistory([]);
                  setChatInput("");
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
                  setChatHistory([]);
                  setChatInput("");
                  setAiMoodLabel("");
                  setAiReply("");
                  setUserMoodDescription("");
                  setAnalyzedMood(null);
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
            setShowAIChat(false);
            setShowPlaces(false);
            setUserMoodDescription("");
            setAiMoodLabel("");
            setAiReply("");
            setIsLoadingAI(false);
            setChatHistory([]);
            setChatInput("");
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
                setChatHistory([]);
                setChatInput("");
                setAiMoodLabel("");
                setAiReply("");
                setUserMoodDescription("");
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
          <button
            onClick={() => {
              setShowMoodInput(true);
              setShowMoodConfirmation(false);
              setShowAIChat(false);
              setAnalyzedMood(null);
              setChatHistory([]);
              setChatInput("");
              setAiMoodLabel("");
              setAiReply("");
            }}
            style={{
              marginTop: "16px",
              padding: "10px 16px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "white",
              fontWeight: 500,
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.2s, transform 0.2s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1.01)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Ruh hâli tespit edilemediyse yazıyla paylaş
          </button>
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/suggest" element={<SuggestPlaces />} />
    </Routes>
  );
}
