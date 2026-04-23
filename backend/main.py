"""
main.py — FastAPI application entry point
Emotion-Based Music Recommendation App
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Import route modules
from routes.emotion_face import router as face_router
from routes.emotion_text import router as text_router
from routes.weather import router as weather_router
from routes.recommend import router as recommend_router

# ── App Initialization ────────────────────────────────────────────────────────
app = FastAPI(
    title="Emotion Music Recommender API",
    description="Detects emotion via webcam, text, or manual input and recommends music.",
    version="1.0.0",
)

# ── CORS Middleware ───────────────────────────────────────────────────────────
# Allows the React frontend (running on localhost:5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"), "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ──────────────────────────────────────────────────────────
app.include_router(face_router,     prefix="/api", tags=["Face Emotion"])
app.include_router(text_router,     prefix="/api", tags=["Text Emotion"])
app.include_router(weather_router,  prefix="/api", tags=["Weather"])
app.include_router(recommend_router,prefix="/api", tags=["Recommendations"])


@app.get("/", tags=["Health"])
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Emotion Music API is running 🎵"}


# ── Dev Server ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
