/**
 * utils/api.js
 * Centralized Axios API client — all backend calls go through here.
 */

import axios from 'axios'

// Base URL from environment variable or default to local backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout (DeepFace/HuggingFace can be slow on first load)
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ── API Methods ───────────────────────────────────────────────────────────────

/** Detect emotion from a webcam base64 image */
export const detectFaceEmotion = (base64Image) =>
  api.post('/api/detect-face-emotion', { image: base64Image })

/** Detect emotion from a text string */
export const detectTextEmotion = (text) =>
  api.post('/api/detect-text-emotion', { text })

/** Fetch song recommendations */
export const recommendSongs = ({ emotion, page_token, custom_query }) =>
  api.post('/api/recommend-songs', { emotion, page_token, custom_query })

export default api
