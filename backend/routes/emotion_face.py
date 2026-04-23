"""
routes/emotion_face.py
POST /api/detect-face-emotion
Accepts a base64-encoded image from the webcam and returns detected emotion via DeepFace.
"""

import base64
import io
import numpy as np
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class ImagePayload(BaseModel):
    """Request body: base64-encoded image data (with or without data URI prefix)."""
    image: str  # e.g. "data:image/jpeg;base64,/9j/4AAQ..."


@router.post("/detect-face-emotion")
async def detect_face_emotion(payload: ImagePayload):
    """
    Detects the dominant emotion from a webcam-captured image.

    - Accepts base64 image string
    - Uses DeepFace to analyze facial expressions
    - Returns dominant emotion + confidence scores
    """
    try:
        # ── Decode Base64 Image ───────────────────────────────────────────────
        image_data = payload.image

        # Strip the data URI prefix if present (e.g. "data:image/jpeg;base64,")
        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_array = np.array(image)

        # ── DeepFace Analysis ─────────────────────────────────────────────────
        # Import here to avoid slow startup time if not used
        from deepface import DeepFace

        result = DeepFace.analyze(
            img_path=img_array,
            actions=["emotion"],
            enforce_detection=False,  # Don't throw error if no face found
            silent=True,
        )

        # DeepFace returns a list; take the first (most prominent) face
        face_data = result[0] if isinstance(result, list) else result
        dominant_emotion = face_data["dominant_emotion"]
        emotion_scores   = face_data["emotion"]  # dict of all scores

        return {
            "success": True,
            "emotion": dominant_emotion.lower(),
            "scores": {k: round(v, 2) for k, v in emotion_scores.items()},
            "source": "webcam",
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Face emotion detection failed: {str(e)}"
        )
