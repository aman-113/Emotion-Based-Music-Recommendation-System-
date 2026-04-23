"""
routes/weather.py
GET /api/get-weather?city={city_name}
Fetches live weather from OpenWeather API and returns condition + day/night flag.
"""

import os
import httpx
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5/weather"


@router.get("/get-weather")
async def get_weather(city: str = Query(..., description="City name, e.g. 'London'")):
    """
    Fetches current weather for a given city using OpenWeather API.

    Returns:
        - city name
        - temperature (°C)
        - weather condition (main, e.g. 'Rain', 'Clear')
        - description (e.g. 'light rain')
        - weather icon URL
        - is_night flag (True if between sunset and sunrise)
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENWEATHER_API_KEY not configured.")

    params = {
        "q":     city.strip(),
        "appid": api_key,
        "units": "metric",   # °C
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(OPENWEATHER_BASE, params=params)

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"City '{city}' not found.")
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Weather service unavailable.")

        data = response.json()

        # ── Parse Response ────────────────────────────────────────────────────
        weather_main  = data["weather"][0]["main"]       # e.g. "Rain"
        weather_desc  = data["weather"][0]["description"] # e.g. "light rain"
        icon_code     = data["weather"][0]["icon"]
        temp_c        = round(data["main"]["temp"], 1)
        feels_like    = round(data["main"]["feels_like"], 1)
        humidity      = data["main"]["humidity"]
        city_name     = data["name"]
        country       = data["sys"]["country"]

        # Determine is_night from icon code (OpenWeather appends 'n' for night icons)
        is_night = icon_code.endswith("n")

        icon_url = f"https://openweathermap.org/img/wn/{icon_code}@2x.png"

        # Effective weather key (override to "night" if is_night and clear sky)
        effective_condition = "night" if (is_night and weather_main.lower() == "clear") else weather_main.lower()

        return {
            "success":            True,
            "city":               city_name,
            "country":            country,
            "temperature_c":      temp_c,
            "feels_like_c":       feels_like,
            "humidity_pct":       humidity,
            "condition":          weather_main,          # raw: "Rain", "Clear", etc.
            "effective_condition":effective_condition,   # used for mapping
            "description":        weather_desc,
            "icon_url":           icon_url,
            "is_night":           is_night,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather fetch failed: {str(e)}")
