/**
 * components/WeatherBadge.jsx
 * Displays current weather info fetched from OpenWeather API.
 */

import { useState } from 'react'
import { MapPin, Search, Thermometer } from 'lucide-react'
import { getWeather } from '../utils/api'
import { SpinnerIcon } from './Loader'

export default function WeatherBadge({ weather, onWeatherFetched }) {
  const [city,    setCity]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await getWeather(city.trim())
      onWeatherFetched(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather()
  }

  return (
    <div className="space-y-3">
      {/* City Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your city (e.g. Mumbai)"
            className="input-field pl-9 text-sm"
          />
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading || !city.trim()}
          className="btn-primary px-4 py-3 flex items-center gap-2"
        >
          {loading ? <SpinnerIcon size={14} /> : <Search size={14} />}
          <span className="hidden sm:inline">Get Weather</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Weather Display */}
      {weather && (
        <div className="flex items-center gap-4 p-4 glass-card animate-slide-up">
          <img
            src={weather.icon_url}
            alt={weather.description}
            className="w-12 h-12 object-contain"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">
              {weather.city}, {weather.country}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {weather.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-accent font-bold">
            <Thermometer size={14} />
            {weather.temperature_c}°C
          </div>
          <div className="text-xs text-gray-400 hidden sm:block">
            {weather.is_night ? '🌙 Night' : '☀️ Day'}
          </div>
        </div>
      )}
    </div>
  )
}
