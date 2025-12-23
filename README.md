## 🧠 MindRoute – Duygu Tabanlı Şehir ve Mekan Öneri Uygulaması

MindRoute, kullanıcının **ruh halini analiz ederek** ona uygun **mekan ve şehir önerileri** sunan bir web uygulamasıdır.  
Frontend tarafında **React + Vite**, backend tarafında ise **Node.js (Express) + Prisma + OpenStreetMap / Google Places** kullanılmaktadır.

Bu README, projeye yeni gelen birinin **hiçbir şey bilmese bile** projeyi indirip çalıştırabilmesi ve mimariyi anlayabilmesi için hazırlanmıştır.

---

## GitHub Deposu

Projenin GitHub üzerindeki ana reposu:  
[MindrouteMainEnd](https://github.com/gokiceynn/MindrouteMainEnd)

---

## İçindekiler

- **Genel Mimari**
- **Teknolojiler**
- **Projenin Klasör Yapısı**
- **Gereksinimler**
- **Kurulum (Frontend + Backend)**
- **Çalıştırma**
- **Ortam Değişkenleri**
- **Veritabanı (Prisma / SQLite)**
- **Ana Özellikler**
- **Backend API Özetleri**
- **Geliştirme İpuçları**

---

## Genel Mimari

- **Frontend (`frontend/`)**
  - React ile yazılmış SPA (Single Page Application).
  - Kullanıcı ruh halini yazılı olarak girer.
  - Backend’den gelen **ruh hali etiketi** ve **mekan önerilerini** gösterir.
  - Şehir / duygu seçimi, mekan listesi ve mini asistan bileşenleri içerir.

- **Backend (`mood-backend/`)**
  - Node.js + Express tabanlı REST API.
  - Kullanıcının yazdığı metinden **manual duygu analizi** yapar (`mood-engine.js`).
  - Şehir ve duyguya göre **OpenStreetMap (Overpass API)** ve gerekirse **Google Places API** üzerinden mekan önerir.
  - Kullanıcı & mood log’larını **Prisma** aracılığıyla SQLite veritabanına kaydedebilir.

Frontend, backend ile HTTP üzerinden konuşur:

- Metin analizi için: `POST /api/mood-text`
- Mekan önerileri için: `POST /suggest-places` veya `GET /api/suggest` / `GET /api/places`

---

## Teknolojiler

- **Frontend**
  - React
  - Vite
  - React Router
  - Tailwind CSS (konfigürasyona göre)

- **Backend**
  - Node.js + Express
  - Prisma (SQLite veritabanı)
  - OpenStreetMap Overpass API
  - Nominatim (şehir koordinatları için)
  - Google Places / Maps API (fallback olarak turistik ve yakın yerler için)
  - dotenv (ortam değişkenleri)

---

## Proje Klasör Yapısı

- `frontend/`
  - React + Vite projesi
  - `src/pages/Home.jsx`, `Analyzer.jsx`, `SuggestPlaces.jsx` vb.
  - `src/components/MiniAssistant.jsx` – metin tabanlı ruh hali asistanı
- `mood-backend/`
  - `index.js` – Express sunucusu ve tüm ana endpoint’ler
  - `mood-engine.js` – basit kural tabanlı duygu analizi
  - `osm-map.js` – duygu → OSM kategorileri haritası
  - `prisma/schema.prisma` – veritabanı şeması
  - `prisma/dev.db` – SQLite veritabanı
  - `env.example` – ortam değişkeni şablonu

---

## Gereksinimler

- **Node.js**: 18+ (LTS önerilir)
- **npm**: Node ile birlikte gelir
- İnternet bağlantısı (OSM / Google API’leri için)

Ek olarak backend için:

- (Opsiyonel ama önerilir) **Google Places / Maps API key**

---

## Kurulum

Projeyi klonladıktan sonra (veya zip olarak indirdikten sonra) ana klasöre gidin:

```bash
cd /Users/gokcenusta/Desktop/MindrouteMainEnd-main
```

### 1. Frontend kurulumu

```bash
cd frontend
npm install
```

Bu komut, `frontend/package.json` içindeki tüm bağımlılıkları (React, Vite, vb.) kurar.

### 2. Backend kurulumu

```bash
cd ../mood-backend
npm install
```

Bu komut, Express, Prisma, dotenv, vb. backend bağımlılıklarını kurar.

---

## Çalıştırma

### 1. Backend’i başlat

Önce backend dizinine geç:

```bash
cd mood-backend
```

Ardından:

```bash
npm start
```

Varsayılan olarak:

- Backend şu adreste çalışır: `http://localhost:3000`

Portu değiştirmek istersen `.env` içindeki `PORT` değerini güncelleyebilirsin.

### 2. Frontend’i başlat

Yeni bir terminal penceresi açıp:

```bash
cd /Users/gokcenusta/Desktop/MindrouteMainEnd-main/frontend
npm run dev
```

Vite dev server başlayacak ve genelde şu adreste olur:

- `http://localhost:5173` (veya terminalde yazan port)

Tarayıcıdan bu adrese giderek uygulamayı görebilirsin.

> **Önemli:** Frontend’in backend’e istek atabilmesi için **önce backend’in çalışıyor olması** gerekir.

---

## Ortam Değişkenleri

Backend dizininde (`mood-backend/`) bir `.env` dosyası kullanılır.

1. Şablonu kopyala:

```bash
cd mood-backend
cp env.example .env
```

2. `.env` dosyasını açıp aşağıdaki değerleri güncelle:

- `PORT` – Backend portu (örn. `3000`)
- `GOOGLE_PLACES_API_KEY` veya `GOOGLE_MAPS_API_KEY` – Google Places / Maps API key

> **Not:** `.env` dosyası `.gitignore` içinde yer alır; repo’ya push’lama.

---

## Veritabanı (Prisma / SQLite)

Backend, `prisma/schema.prisma` dosyasında tanımlı olan şemayı kullanır ve varsayılan olarak `prisma/dev.db` isimli bir **SQLite** dosyasına kaydeder.

- **User kayıtları** ve **ruh hali logları** için tablolar bulunur.
- Migration’lar `prisma/migrations` klasöründe tutulur.

Yeni migration oluşturmak veya şemayı değiştirmek istersen:

```bash
cd mood-backend
npx prisma migrate dev
```

Veritabanını görselleştirmek için:

```bash
npx prisma studio
```

---

## Ana Özellikler

- Kullanıcı, yazdığı metinle **ruh halini ifade eder**.
- Backend, `mood-engine.js` ile metni analiz eder ve bir **duygu etiketi** üretir:
  - Örnek etiketler: `happy`, `sad`, `anxious`, `angry`, `lonely`, `tired`, `unsure` vb.
- Kullanıcı, bulunduğu **şehri** de belirtebilir.
- Backend, şehir + duygu bilgisine göre:
  - OpenStreetMap Overpass API ile uygun mekanları bulur.
  - Gerekirse Google Places API’ye fallback yapar.
  - Mekan isimlerini mümkün olduğunca **Türkçeleştirir** (Arapça vs. isimleri OSM’den Türkçe isimle değiştirir).

Frontend’de:

- Mini asistan kullanıcıya empatik yanıtlar verebilir.
- Önerilen mekanlar liste halinde gösterilir.

---

## Backend API Özetleri

Backend ana dosyası: `mood-backend/index.js`

- **`POST /api/mood-text`**
  - **Amaç**: Kullanıcının yazdığı metinden duygu tespiti yapmak.
  - **Body**:
    ```json
    {
      "message": "Bugün biraz gergin hissediyorum"
    }
    ```
  - **Response**:
    ```json
    {
      "mood_label": "anxious",
      "reply": "..." 
    }
    ```

- **`POST /save-mood`**
  - Kullanıcının ruh hali kaydını veritabanına yazar.
  - **Body**:
    ```json
    {
      "userId": 1,
      "emotion": "happy",
      "message": "Arkadaşlarımla güzel bir gün geçirdim"
    }
    ```

- **`POST /suggest-places`**
  - Şehir + duygu bilgisine göre mekan önerir (OSM + Overpass).
  - **Body**:
    ```json
    {
      "city": "İstanbul",
      "emotion": "sad"
    }
    ```
  - **Response (özet)**:
    ```json
    {
      "success": true,
      "count": 5,
      "places": [
        {
          "id": 123,
          "name": "Gülhane Parkı",
          "type": "park",
          "lat": 41.01,
          "lon": 28.97
        }
      ]
    }
    ```

- **`GET /api/suggest?city=İstanbul&mood=happy`**
  - Query parametreleriyle çalışan tam özellikli mekan öneri endpoint’i.

- **`GET /api/places?city=İstanbul&mood=sad`**
  - Duyguya göre tanımlanmış OSM tag’leri ile turistik / doğal yerler önerir.

---

## Geliştirme İpuçları

- Frontend geliştirme için:
  - Kodlar `frontend/src/` altında.
  - Yeni sayfa eklemek için `pages/` klasörünü kullan.
  - Yeni bileşenler için `components/` klasörünü kullan.

- Backend geliştirme için:
  - Yeni endpoint’leri `mood-backend/index.js` içine ekleyebilirsin.
  - Duygu analizi kurallarını `mood-engine.js` içinde genişletebilirsin.
  - OSM kategori haritalarını `osm-map.js` içinden yönetebilirsin.

Pull request açmadan önce:

- Frontend’te:
  ```bash
  cd frontend
  npm run lint
  ```
- Backend’te en azından temel akışları test et:
  - `/api/mood-text`
  - `/suggest-places` veya `/api/suggest`

---

Bu README’yi okuyan biri:

- Gerekli araçları kurup,
- Frontend ve backend’i ayağa kaldırabilir,
- Temel akışı (metin → duygu → mekan önerisi) anlayabilir,
- Kodu genişletmek için hangi dosyalara bakması gerektiğini görebilir.

---

## Detaylı Kurulum ve Çalışma Dokümantasyonu

MindRoute – Ruh Hâli Analizi ve Mekan Öneri Sistemi

MindRoute, kullanıcının yazdığı metni işleyerek ruh hâlini sınıflandıran ve bu duyguya göre şehirdeki uygun mekanları öneren tam yığın (full-stack) bir web uygulamasıdır. Uygulama, kullanıcı kayıt/giriş sistemi, veri tabanı yönetimi, duygu analizi ve mekan öneri motoru gibi özellikler içerir.

Bu doküman, projeyi yerel ortamda (local development) çalıştırmak için gerekli kurulum süreçlerini baştan sona açıklar.

1. Proje Mimarisi

Proje iki ana bileşenden oluşur:

MindRoute/
│
├── mood-backend/      → Node.js + Express + Prisma + SQLite
│
└── frontend/          → React + Vite + React Router

Her iki bileşen ayrı terminal pencerelerinde çalıştırılır.

2. Gereksinimler

Projenin çalışması için aşağıdaki araçların sistemde kurulu olması gerekir:

Node.js 18+

npm 9+

SQLite3 (Prisma, SQLite dosyasını otomatik oluşturur)

macOS, Windows veya Linux işletim sistemi

3. Backend Kurulumu (mood-backend)

3.1 Klasöre girme

Terminalde:

```bash
cd mood-backend
```

3.2 Bağımlılıkların kurulması

```bash
npm install
```

3.3 .env dosyasının oluşturulması

`mood-backend` klasörüne `.env` adlı bir dosya oluşturun ve içine şunları yazın:

```env
PORT=3000
DATABASE_URL="file:./prisma/dev.db"

# İsteğe bağlıdır. Google API kullanmak istemezseniz boş bırakabilirsiniz.
GOOGLE_PLACES_API_KEY=YOUR_API_KEY
```

Bu dosya, backend’in konfigürasyon ayarlarını içerir ve kullanıcıya gösterilmez.

3.4 Veritabanının oluşturulması

```bash
npx prisma migrate dev --name init
```

Komut sonunda `dev.db` adlı SQLite veritabanı oluşturulur.

3.5 Backend’i başlatma

```bash
npm start
```

Terminalde şu mesaj görünmelidir:

```text
Backend çalışıyor: http://localhost:3000
```

4. Frontend Kurulumu

4.1 Klasöre girme

Yeni bir terminal penceresi açın:

```bash
cd frontend
```

4.2 Bağımlılıkların kurulması

```bash
npm install
```

4.3 Frontend’i başlatma

```bash
npm run dev
```

Arayüz genellikle şu adreste açılır:

```text
http://localhost:5173
```

5. Çalışma Mantığı

5.1 Kullanıcı doğrulama (basit demo düzeyi)

Şu an backend’de yalnızca **basit bir kullanıcı kayıt endpoint’i** vardır:

- `POST /register`

Bu endpoint, e-posta ve şifreyi veritabanına **doğrudan** kaydeder; henüz JWT, oturum yönetimi veya şifre hashleme **uygulanmamıştır**.  
Gerçek bir projede buraya mutlaka **şifre hashleme (bcrypt gibi)** ve **JWT tabanlı kimlik doğrulama** eklenmelidir.

5.2 Duygu analizi

Mini chatbot, backend’deki:

`POST /api/mood-text`

endpointine mesaj gönderir.

Backend, kelime analizine göre duygu tespit eder ve hem duygu etiketini hem de cevap metnini döner.

5.3 Mekan öneri motoru

Kullanıcının seçtiği şehir ve tespit edilen duygu, backend’e şu API üzerinden gönderilir:

`POST /suggest-places`

Backend şu servisleri birleştirerek mekanları önerir:

- OpenStreetMap – Overpass API
- Nominatim (reverse geocoding)
- Google Places API (fallback)

Gelen mekanlar tür, koordinat ve isim bilgileriyle frontend’e iletilir.

5.4 Profil / geçmiş (planlanan özellikler)

Prisma şeması, kullanıcı (`User`) ve ruh hâli kayıtlarını (`MoodLog`) destekleyecek şekilde tasarlanmıştır;  
ancak şu anda frontend’de **profil sayfası, favori mekanlar ve geçmiş görüntüleme ekranları henüz implemente edilmemiştir.**  
İleride bu veriler SQLite veritabanında tutulan kayıtlardan okunarak profil / geçmiş sayfaları eklenebilir.

6. Proje Dizin Yapısı

MindRoute/
│
├── mood-backend/
│   ├── prisma/
│   │   └── schema.prisma       → Veritabanı modelleri
│   ├── node_modules/
│   ├── index.js                → Ana backend server
│   ├── osm-map.js              → Duygu → mekan kategorisi eşleme
│   ├── mood-engine.js          → Metin duygu analizi motoru
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/              → Sayfalar (Login, Register, SuggestPlaces vb.)
    │   ├── components/         → MiniAssistant chatbot, Navbar vb.
    │   ├── assets/             → Görseller (chatbot.png, arka planlar vb.)
    │   └── App.jsx             → Ana yönlendirme
    ├── public/
    ├── package.json
    └── vite.config.js

7. Uygulamanın Çalıştırılması (Özet)

İki ayrı terminal açın.

**Terminal 1 – Backend:**

```bash
cd mood-backend
npm start
```

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

Ardından tarayıcıda:

```text
http://localhost:5173
```

adresine giderek uygulamayı kullanabilirsiniz.

8. Sorun Giderme (Troubleshooting)

**Backend çalışmıyor, port hatası**

`PORT=3000` başka uygulama tarafından kullanılıyorsa `.env` dosyasında portu değiştirin:

```env
PORT=4000
```

Frontend’de de istek atılan URL’yi güncelleyin.

**Prisma migrate çalışmıyor**

Şu komutla Prisma client’i yenileyin:

```bash
npx prisma generate
```
9. Güvenlik Notları

- `.env` dosyası hiçbir şekilde depo içine yüklenmez.
- Şu anki örnek backend’de şifreler **şifrelenmeden (plain text)** saklanmaktadır; bu sadece geliştirme/demonstrasyon içindir.
- Üretim ortamında mutlaka **şifre hashleme (örneğin bcrypt)** ve **JWT veya benzeri bir oturum sistemi** eklenmelidir.
- JWT veya benzeri bir mekanizma eklendiğinde, token’ın yalnızca tarayıcı `httpOnly` cookie veya güvenli bir saklama alanında tutulması önerilir.
