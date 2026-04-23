"""
utils/emotion_weather_map.py
Maps (emotion, weather_condition) → YouTube search query string
"""

# ── Primary Mapping ───────────────────────────────────────────────────────────
# Keys are (emotion, weather_category) tuples
# weather_category is derived from OpenWeather's main condition field (lowercased)

EMOTION_WEATHER_MAP: dict[tuple[str, str], str] = {
    # Happy combinations
    ("happy",   "clear"):        "happy upbeat pop songs",
    ("happy",   "clouds"):       "feel good indie songs",
    ("happy",   "rain"):         "happy rainy day songs",
    ("happy",   "snow"):         "joyful winter songs",
    ("happy",   "thunderstorm"): "energetic rock songs",
    ("happy",   "drizzle"):      "cheerful acoustic songs",
    ("happy",   "mist"):         "happy lo-fi chill music",
    ("happy",   "fog"):          "dreamy happy songs",
    ("happy",   "night"):        "happy night drive songs",

    # Sad combinations
    ("sad",     "clear"):        "sad songs sunny day",
    ("sad",     "clouds"):       "sad cloudy day music",
    ("sad",     "rain"):         "sad acoustic rainy songs",
    ("sad",     "snow"):         "sad winter songs",
    ("sad",     "thunderstorm"): "sad emotional songs storm",
    ("sad",     "drizzle"):      "melancholic acoustic songs",
    ("sad",     "mist"):         "emotional indie sad songs",
    ("sad",     "fog"):          "moody sad songs",
    ("sad",     "night"):        "sad night songs heartbreak",

    # Angry combinations
    ("angry",   "clear"):        "calm down instrumental music",
    ("angry",   "clouds"):       "chill music to calm anger",
    ("angry",   "rain"):         "calm rain sounds music",
    ("angry",   "snow"):         "peaceful piano music",
    ("angry",   "thunderstorm"): "heavy metal thunderstorm songs",
    ("angry",   "drizzle"):      "soothing jazz music",
    ("angry",   "mist"):         "calming ambient music",
    ("angry",   "fog"):          "meditation calm music",
    ("angry",   "night"):        "calm late night music",

    # Neutral combinations
    ("neutral", "clear"):        "lofi chill sunny study music",
    ("neutral", "clouds"):       "lofi hip hop study music",
    ("neutral", "rain"):         "lofi rainy day music",
    ("neutral", "snow"):         "chill winter lo-fi music",
    ("neutral", "thunderstorm"): "ambient storm background music",
    ("neutral", "drizzle"):      "relaxing lofi drizzle music",
    ("neutral", "mist"):         "ethereal ambient music",
    ("neutral", "fog"):          "atmospheric chill music",
    ("neutral", "night"):        "lofi chill night music",

    # Surprised combinations
    ("surprise","clear"):        "upbeat funky songs",
    ("surprise","clouds"):       "indie alternative hits",
    ("surprise","rain"):         "unexpected pop hits",
    ("surprise","snow"):         "quirky fun songs",
    ("surprise","night"):        "surprise party music playlist",

    # Fear combinations
    ("fear",    "clear"):        "soothing calming music",
    ("fear",    "clouds"):       "relaxing anxiety relief music",
    ("fear",    "rain"):         "comforting rainy music",
    ("fear",    "thunderstorm"): "peaceful music thunderstorm",
    ("fear",    "night"):        "calming sleep music",

    # Disgust combinations
    ("disgust", "clear"):        "uplifting feel good songs",
    ("disgust", "clouds"):       "motivational music playlist",
    ("disgust", "rain"):         "positive vibes music",
    ("disgust", "night"):        "good mood night music",
}

# ── Fallback Queries ──────────────────────────────────────────────────────────
# Used when a specific (emotion, weather) combo is not in the map

EMOTION_FALLBACK: dict[str, str] = {
    "happy":    "happy upbeat songs playlist",
    "sad":      "sad emotional songs playlist",
    "angry":    "calm instrumental music",
    "neutral":  "lofi chill music playlist",
    "surprise": "fun energetic songs",
    "fear":     "soothing calming music",
    "disgust":  "uplifting positive songs",
}

WEATHER_FALLBACK: dict[str, str] = {
    "clear":        "sunny day songs",
    "clouds":       "cloudy day lofi",
    "rain":         "rainy day music",
    "snow":         "winter chill songs",
    "thunderstorm": "storm ambient music",
    "drizzle":      "drizzle acoustic songs",
    "mist":         "misty morning music",
    "fog":          "foggy chill music",
    "night":        "night chill music",
}


def get_search_query(emotion: str, weather_condition: str) -> str:
    """
    Returns a YouTube search query string based on emotion + weather.

    Args:
        emotion: Detected emotion string (e.g. "happy", "sad")
        weather_condition: Weather condition from OpenWeather API (e.g. "Rain", "Clear")

    Returns:
        A YouTube search query string
    """
    emotion_key    = emotion.lower().strip()
    weather_key    = weather_condition.lower().strip()

    # Direct lookup
    query = EMOTION_WEATHER_MAP.get((emotion_key, weather_key))
    if query:
        return query

    # Fallback to emotion-only
    query = EMOTION_FALLBACK.get(emotion_key)
    if query:
        return query

    # Last resort
    return f"{emotion_key} music playlist"


def normalize_weather_condition(openweather_main: str, is_night: bool = False) -> str:
    """
    Normalizes OpenWeather's 'main' condition field to our map key.
    Also handles day/night distinction.
    """
    if is_night:
        return "night"
    return openweather_main.lower().strip()
