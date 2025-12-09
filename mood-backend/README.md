# Mood Backend

MindRoute projesi için ruh hali analiz backend servisi.

## Kurulum

```bash
npm install
```

### Ortam değişkenleri

1. `env.example` dosyasını `.env` olarak kopyalayın:

   ```bash
   cp env.example .env
   ```

2. `.env` içindeki `OPENAI_API_KEY` değerini kendi OpenAI API anahtarınızla değiştirin.

> **Not:** `.env` dosyası `.gitignore` içinde yer alır; repo’ya eklemeyin.

## Çalıştırma

```bash
npm start
```

Varsayılan olarak `http://localhost:3000` adresinde çalışır. Farklı port isterseniz `.env` içindeki `PORT` değerini güncelleyebilirsiniz.

## API Endpoints

### POST /api/mood-chat

Kullanıcının yazdığı metni OpenAI Responses API üzerinden analiz eder, ruh halini etiketler ve empatik bir cevap üretir.

**Request gövdesi**

```json
{
  "message": "kendimi çok yalnız hissediyorum",
  "history": [
    { "role": "user", "content": "daha önceki mesajım" },
    { "role": "assistant", "content": "AI cevabı" }
  ]
}
```

- `message` (zorunlu): Kullanıcının son mesajı
- `history` (opsiyonel): Çok turlu sohbet için önceki mesajlar. `role` alanı `user` veya `assistant` olmalıdır.

**Response:**

```json
{
  "mood_label": "yalnız hissediyor",
  "reply": "Yalnız hissettiğini söylemen çok kıymetli..."
}
```

## Test

```bash
curl -X POST http://localhost:3000/api/mood-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"kendimi çok yalnız hissediyorum"}'
```

## Notlar

- OpenAI API anahtarı olmadan çalıştırırsanız fallback cevap döner.
- `history` alanı sayesinde ileride çok turlu sohbet deneyimi kurabilirsiniz.

