"""
utils/emotion_query_map.py
Maps emotion -> YouTube search query string
"""

EMOTION_QUERY_MAP: dict[str, str] = {
    "happy":    "happy upbeat songs playlist",
    "sad":      "sad emotional songs playlist",
    "angry":    "calm instrumental music",
    "neutral":  "lofi chill music playlist",
    "calm":     "calm relaxing instrumental music",
    "surprise": "fun energetic songs",
    "fear":     "soothing calming music",
    "disgust":  "uplifting positive songs",
}


def get_search_query(emotion: str) -> str:
    """
    Returns a YouTube search query string based on emotion only.

    Args:
        emotion: Detected emotion string (e.g. "happy", "sad")

    Returns:
        A YouTube search query string
    """
    emotion_key = emotion.lower().strip()
    query = EMOTION_QUERY_MAP.get(emotion_key)
    if query:
        return query

    return f"{emotion_key} music playlist"
