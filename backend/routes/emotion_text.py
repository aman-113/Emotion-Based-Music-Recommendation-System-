"""
routes/emotion_text.py
POST /api/detect-text-emotion
Accepts a text string and returns detected emotion using HuggingFace Transformers.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# ── Emotion label mapping ─────────────────────────────────────────────────────
# Map HuggingFace model labels → our app's canonical emotion labels
LABEL_MAP = {
    "joy":      "happy",
    "happiness":"happy",
    "sadness":  "sad",
    "anger":    "angry",
    "fear":     "fear",
    "surprise": "surprise",
    "disgust":  "disgust",
    "neutral":  "neutral",
    "love":     "happy",
    "optimism": "happy",
    "pessimism":"sad",
}


class TextPayload(BaseModel):
    """Request body: plain text describing the user's feelings."""
    text: str


# Lazy-load the pipeline to avoid slow startup time
_pipeline = None

def get_pipeline():
    """Lazily loads the emotion classification pipeline."""
    global _pipeline
    if _pipeline is None:
        from transformers import pipeline
        # j-hartmann/emotion-english-distilroberta-base detects 7 emotions
        _pipeline = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=None,          # Return ALL emotion scores
            truncation=True,
            max_length=512,
        )
    return _pipeline


@router.post("/detect-text-emotion")
async def detect_text_emotion(payload: TextPayload):
    """
    Detects emotion from a user-submitted text string.

    - Uses HuggingFace 'j-hartmann/emotion-english-distilroberta-base'
    - Returns dominant emotion + all confidence scores
    """
    if not payload.text or len(payload.text.strip()) < 3:
        raise HTTPException(status_code=400, detail="Text too short. Please enter at least 3 characters.")

    try:
        pipe = get_pipeline()
        results = pipe(payload.text.strip())[0]  # List of {label, score}

        # Sort by score descending
        results_sorted = sorted(results, key=lambda x: x["score"], reverse=True)

        # Get dominant emotion (map to our label if needed)
        raw_label      = results_sorted[0]["label"].lower()
        dominant_emotion = LABEL_MAP.get(raw_label, raw_label)

        # Build scores dict with mapped labels
        scores = {}
        for item in results_sorted:
            mapped = LABEL_MAP.get(item["label"].lower(), item["label"].lower())
            # Keep highest score if multiple labels map to same key
            if mapped not in scores or item["score"] > scores[mapped]:
                scores[mapped] = round(item["score"] * 100, 2)

        return {
            "success": True,
            "emotion": dominant_emotion,
            "scores": scores,
            "source": "text",
            "input_text": payload.text[:100],  # Echo back truncated input
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text emotion detection failed: {str(e)}"
        )
