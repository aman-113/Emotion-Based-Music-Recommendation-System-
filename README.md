# 🎵 MoodTunes — Emotion-Based Music Recommendation App

An AI-powered web app that detects your emotion via **webcam**, **text analysis**, or **manual selection**, combines it with **live weather data**, and recommends **YouTube music videos** perfectly matched to your mood.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 😄 Face Detection | Webcam captures your face → DeepFace analyzes emotion |
| ✍️ Text Analysis | Type how you feel → HuggingFace Transformers detects emotion |
| 👆 Manual Select | Pick from 7 emotions via a clean UI |
| 🌤 Weather Context | Live weather via OpenWeather API tailors your playlist |
| 🎬 YouTube Songs | 9 videos per page from YouTube Data API v3 |
| 📄 Pagination | Next/Prev page navigation |
| 🌙 Dark/Light Mode | Toggle with localStorage persistence |
| 📱 Responsive | Works on mobile, tablet, desktop |

---

## 🗂 Project Structure

```
emotion-music-app/
├── backend/
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variable template
│   ├── routes/
│   │   ├── emotion_face.py          # POST /api/detect-face-emotion
│   │   ├── emotion_text.py          # POST /api/detect-text-emotion
│   │   ├── weather.py               # GET  /api/get-weather
│   │   └── recommend.py             # POST /api/recommend-songs
│   └── utils/
│       └── emotion_weather_map.py   # Emotion+Weather → search query mapping
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Router + Navbar + Theme
        ├── index.css                # Tailwind + custom styles
        ├── hooks/
        │   └── useTheme.js          # Dark/light mode hook
        ├── utils/
        │   ├── api.js               # Axios API client
        │   └── emotions.js          # Emotion metadata constants
        ├── components/
        │   ├── EmotionDetector.jsx  # Webcam face detection
        │   ├── ManualEmotionInput.jsx # Emotion picker grid
        │   ├── TextEmotionInput.jsx # Text → emotion AI
        │   ├── WeatherBadge.jsx     # City weather widget
        │   ├── SongCard.jsx         # Individual song card
        │   ├── SongList.jsx         # Song grid + pagination
        │   ├── ThemeToggle.jsx      # Sun/Moon toggle
        │   └── Loader.jsx           # Loading spinner
        └── pages/
            ├── Home.jsx             # Main page (detection flow)
            └── Recommendations.jsx  # Results page
```

---

## ⚙️ Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **API Keys:**
  - [OpenWeather API](https://openweathermap.org/api) (free tier works)
  - [YouTube Data API v3](https://console.developers.google.com/) (free 10,000 quota/day)

---

## 🚀 Setup & Installation

### Step 1: Clone & Setup Backend

```bash
cd emotion-music-app/backend

# Create virtual environment
python -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

> ⚠️ **Note:** DeepFace and PyTorch are large packages (~2GB+). First install may take 5–10 minutes.

---

### Step 2: Configure Backend Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual keys
nano .env  # or use any text editor
```

Your `.env` should look like:
```env
OPENWEATHER_API_KEY=abc123yourkeyhere
YOUTUBE_API_KEY=AIzaSyYourKeyHere
FRONTEND_ORIGIN=http://localhost:5173
```

---

### Step 3: Run the Backend

```bash
# From the backend/ directory with venv active:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend is running at: `http://localhost:8000`  
📖 API Docs (Swagger): `http://localhost:8000/docs`

---

### Step 4: Setup Frontend

```bash
cd emotion-music-app/frontend

# Install Node dependencies
npm install
```

---

### Step 5: Configure Frontend Environment

```bash
cp .env.example .env
```

Default `.env` (no changes needed for local dev since Vite proxy handles it):
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

### Step 6: Run the Frontend

```bash
npm run dev
```

✅ Frontend is running at: `http://localhost:5173`

---

## 🧪 Testing APIs Locally

Once the backend is running, test endpoints via Swagger UI at `http://localhost:8000/docs`

### Test Weather API
```bash
curl "http://localhost:8000/api/get-weather?city=London"
```

### Test Text Emotion API
```bash
curl -X POST "http://localhost:8000/api/detect-text-emotion" \
  -H "Content-Type: application/json" \
  -d '{"text": "I feel so anxious and overwhelmed today"}'
```

### Test Song Recommendations
```bash
curl -X POST "http://localhost:8000/api/recommend-songs" \
  -H "Content-Type: application/json" \
  -d '{"emotion": "happy", "weather_condition": "Clear", "is_night": false}'
```

### Test Face Emotion (base64 image)
```bash
# Encode an image to base64 first, then:
curl -X POST "http://localhost:8000/api/detect-face-emotion" \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQ..."}'
```

---

## 🗺 Application Workflow

```
User Opens App
     │
     ▼
[Select Detection Method]
  ┌──────────┬───────────┬───────────┐
  │  Webcam  │   Text    │  Manual   │
  └──────────┴───────────┴───────────┘
     │
     ▼
[Emotion Detected]
e.g. "happy", "sad", "angry"
     │
     ▼
[Optional: Fetch Live Weather]
City → OpenWeather API → condition + is_night
     │
     ▼
[Navigate to Recommendations]
     │
     ▼
[Backend: Emotion + Weather → Search Query]
("happy", "clear") → "happy upbeat pop songs"
("sad", "rain")    → "sad acoustic rainy songs"
     │
     ▼
[YouTube Data API v3 Search]
Returns 9 video results per page
     │
     ▼
[Frontend: Display Song Cards]
Thumbnail + Title + Channel + Watch on YouTube
     │
     ▼
[Pagination: Next/Prev Page]
```

---

## 🎭 Emotion → Weather → Music Mapping Examples

| Emotion | Weather | Search Query |
|---------|---------|-------------|
| Happy | Clear (Day) | happy upbeat pop songs |
| Sad | Rain | sad acoustic rainy songs |
| Angry | Clear | calm down instrumental music |
| Neutral | Clouds | lofi hip hop study music |
| Fear | Night | calming sleep music |
| Surprise | Clear | upbeat funky songs |
| Happy | Clear (Night) | happy night drive songs |

---

## 🔧 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Camera not working | Allow browser camera permissions; use HTTPS in production |
| DeepFace install fails | Try `pip install deepface tf-keras` separately |
| HuggingFace slow first run | Model downloads on first use (~500MB). Subsequent calls are fast. |
| YouTube quota exceeded | Check your API key quota at Google Cloud Console |
| CORS errors | Ensure `FRONTEND_ORIGIN` in backend `.env` matches your frontend URL |
| `enforce_detection` error | Already handled — DeepFace won't throw if no face found |

---

## 🚢 Production Deployment Notes

**Backend (FastAPI):**
- Use `gunicorn` with `uvicorn` workers: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
- Set `FRONTEND_ORIGIN` to your production frontend domain
- Consider caching HuggingFace model on startup

**Frontend (React/Vite):**
- Build: `npm run build` → serves `dist/` folder
- Deploy to Vercel, Netlify, or any static host
- Set `VITE_API_BASE_URL` to your production backend URL

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Webcam | react-webcam |
| Backend | Python FastAPI |
| Face Emotion | DeepFace (RetinaFace + FER) |
| Text Emotion | HuggingFace distilroberta |
| Weather | OpenWeather API v2.5 |
| Music Videos | YouTube Data API v3 |
| Icons | Lucide React |

---

*Built with ❤️ — MoodTunes v1.0*
