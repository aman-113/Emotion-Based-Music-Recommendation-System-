"""
routes/recommend.py
POST /api/recommend-songs
Uses emotion to generate search query and fetches YouTube videos.
"""

import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from utils.emotion_query_map import get_search_query

router = APIRouter()

YOUTUBE_SEARCH_BASE = "https://www.googleapis.com/youtube/v3/search"

# Max results per page from YouTube API
MAX_RESULTS = 9


class RecommendPayload(BaseModel):
    """Request body for song recommendations."""
    emotion:             str              # e.g. "happy"
    page_token:          Optional[str]    = None  # YouTube pagination token
    custom_query:        Optional[str]    = None  # Override auto-generated query


@router.post("/recommend-songs")
async def recommend_songs(payload: RecommendPayload):
    """
    Returns YouTube song recommendations based on emotion.

    - Builds a context-aware search query from emotion
    - Fetches videos from YouTube Data API v3
    - Returns video metadata + pagination tokens
    """
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY not configured.")

    # ── Build Search Query ────────────────────────────────────────────────────
    if payload.custom_query:
        search_query = payload.custom_query
    else:
        search_query = get_search_query(payload.emotion)

    # ── YouTube API Request ───────────────────────────────────────────────────
    params = {
        "part":       "snippet",
        "q":          search_query,
        "type":       "video",
        "videoCategoryId": "10",   # Music category
        "maxResults": MAX_RESULTS,
        "key":        api_key,
        "safeSearch": "moderate",
        "relevanceLanguage": "en",
    }

    # Add pagination token if continuing from previous page
    if payload.page_token:
        params["pageToken"] = payload.page_token

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(YOUTUBE_SEARCH_BASE, params=params)

        if response.status_code == 403:
            raise HTTPException(status_code=403, detail="YouTube API quota exceeded or access denied.")
        if response.status_code == 400:
            try:
                yt_error = response.json().get("error", {}).get("message", "Invalid YouTube API request or key.")
            except Exception:
                yt_error = "Invalid YouTube API request or key."
            raise HTTPException(status_code=400, detail=f"YouTube API bad request: {yt_error}")
        if response.status_code != 200:
            try:
                yt_error = response.json().get("error", {}).get("message", "YouTube API unavailable.")
            except Exception:
                yt_error = "YouTube API unavailable."
            raise HTTPException(status_code=502, detail=f"YouTube API unavailable: {yt_error}")

        data = response.json()

        # ── Parse Results ─────────────────────────────────────────────────────
        songs = []
        for item in data.get("items", []):
            video_id  = item["id"].get("videoId")
            snippet   = item["snippet"]

            if not video_id:
                continue  # Skip non-video results

            songs.append({
                "video_id":     video_id,
                "title":        snippet.get("title", "Unknown Title"),
                "channel":      snippet.get("channelTitle", "Unknown Artist"),
                "description":  snippet.get("description", "")[:120],
                "thumbnail":    (
                    snippet.get("thumbnails", {})
                    .get("high", {})
                    .get("url")
                    or snippet.get("thumbnails", {}).get("default", {}).get("url", "")
                ),
                "published_at": snippet.get("publishedAt", ""),
                "youtube_url":  f"https://www.youtube.com/watch?v={video_id}",
            })

        return {
            "success":          True,
            "emotion":          payload.emotion,
            "search_query":     search_query,
            "songs":            songs,
            "next_page_token":  data.get("nextPageToken"),
            "prev_page_token":  data.get("prevPageToken"),
            "total_results":    data.get("pageInfo", {}).get("totalResults", 0),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation fetch failed: {str(e)}")
