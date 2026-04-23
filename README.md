# Emotion-Based Music Recommendation System

Mood-driven music recommendations using facial emotion, text emotion, or manual mood selection.

## Features

- Detect emotion from webcam image
- Detect emotion from text input
- Manual emotion selection
- YouTube Data API song recommendations
- Modern React frontend + FastAPI backend

## Tech Stack

- Frontend: React, Vite, TailwindCSS
- Backend: FastAPI, Uvicorn
- AI/NLP: DeepFace, Transformers
- Music source: YouTube Data API v3

## Project Structure

```text
emotion-music-app/
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── emotion_face.py
│   │   ├── emotion_text.py
│   │   └── recommend.py
│   └── utils/
│       └── emotion_query_map.py
└── frontend/
    └── src/
```

## Environment Variables

Create `backend/.env`:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
FRONTEND_ORIGIN=http://localhost:5173
```

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
