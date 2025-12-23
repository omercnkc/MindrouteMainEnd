import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ===== ENV KONTROL ===== */
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "VAR ✅" : "YOK ❌");

/* ===== GEMINI TEST ===== */
async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  /* ===== Gemini ye giden prompt ===== */
  const result = await model.generateContent(
    "Write a short, friendly message in Turkish to welcome users to the Mood Analysis App."
  );

  console.log("\n🔵 Gemini Response:");
  console.log(result.response.text());
}

/* ===== RUN TESTS ===== */
(async () => {
  try {
    await testGemini();
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
})();
