export default function Home() {
  return (
    <div
      className="relative w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/anasayfa1.png')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">MindRoute</h1>
        <p className="mb-10 text-xl drop-shadow-md">
          Duygularına Göre Şehirde Yolculuk
        </p>
        <button className="px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-lg transition-transform hover:scale-105">
          Başla
        </button>
      </div>
    </div>
  );
}








