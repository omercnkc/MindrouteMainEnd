import solAltLeaf from "./assets/solalt.svg";
import solUstLeaf from "./assets/solust.svg";
import sagAltLeaf from "./assets/sagalt.svg";
import sagUstLeaf from "./assets/sagust.svg";
import ustOrtaLeaf from "./assets/ustorta.svg";

export default function App() {
  const containerStyle = {
    backgroundImage: "url('/anasayfa1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    position: "relative",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.20)",
    zIndex: 1,
  };

  // 🌿 SOL ALT YAPRAK (artık import'tan geliyor)
  const leafStyle = {
    position: "absolute",
    bottom: "-80px", // biraz daha dışarı taşıyalım
    left: "-80px",
    width: "420px", // 🔥 yaprak büyüklüğü
    opacity: 0.95,
    pointerEvents: "none",
    zIndex: 2,
  };

  const cardStyle = {
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
    zIndex: 3,
  };

  const titleStyle = {
    color: "#ffecb3",
    fontSize: "20px",
    fontWeight: 700,
    textShadow: "0 3px 8px rgba(0,0,0,0.8)",
  };

  const buttonStyle = {
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
  };

  const buttonHoverStyle = {
    transform: "translateY(2px)",
    boxShadow: "0 6px 0 #b23c00, 0 12px 30px rgba(0,0,0,0.8)",
  };

  let isHover = false;

  return (
    <div style={containerStyle}>
      <div style={overlayStyle} />

      {/* 🌿 Sol alt yaprak */}
      <img src={solAltLeaf} alt="leaf bottom left" className="leaf" style={leafStyle} />
      <img
        src={solUstLeaf}
        alt="Sol üst yaprak"
        className="leaf"
        style={{
          position: "absolute",
          top: "-180px", // biraz yukarı taşı
          left: "-10px", // 🔹 biraz sola çektik
          width: "720px", // dev yaprak efekti 💪
          opacity: 0.95,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <img
        src={sagAltLeaf}
        alt="Sağ alt yaprak"
        className="leaf"
        style={{
          position: "absolute",
          bottom: "-35px", // 🔹 biraz daha aşağı
          right: "-260px",
          width: "1250px",
          opacity: 0.95,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <img
        src={sagUstLeaf}
        alt="Sağ üst yaprak"
        className="leaf"
        style={{
          position: "absolute",
          top: "-160px",
          right: "-100px",
          width: "650px",
          opacity: 0.95,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <img
        src={ustOrtaLeaf}
        alt="Üst orta yaprak"
        className="leaf-center"
        style={{
          position: "absolute",
          top: "-20px", // daha aşağı indirdik, artık görünür olacak
          left: "50%", // tam ortala
          width: "1600px", // biraz daha büyüttük
          opacity: 1,
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* Alt ortadaki kart + buton */}
      <div style={cardStyle}>
        <div style={titleStyle}>Ruh hâline göre rotanı başlat</div>

        <button
          style={{ ...buttonStyle, ...(isHover ? buttonHoverStyle : {}) }}
          onMouseEnter={(e) => {
            isHover = true;
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseLeave={(e) => {
            isHover = false;
            Object.assign(e.currentTarget.style, buttonStyle);
          }}
        >
          Başla
        </button>
      </div>
    </div>
  );
}







