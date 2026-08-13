import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PiCloudSunFill,
  PiArrowLeftBold,
  PiWarningFill,
  PiCheckCircleFill,
  PiDropFill,
  PiWindFill,
  PiSunFill,
  PiNavigationArrowFill,
} from 'react-icons/pi'

function WeatherDashboard() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState('Detecting location...')

  const fetchWeather = async (targetCity) => {
    if (!targetCity) return
    setLoading(true)
    try {
      const response = await fetch(`/api/weather/current?city=${targetCity}`)
      const data = await response.json()
      setWeather(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const detectLocation = () => {
    setLocationStatus('Requesting GPS access...')
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser')
      fetchWeather('Bangalore')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus('Resolving coordinates...')
        try {
          const { latitude, longitude } = position.coords
          // Use OpenStreetMap Nominatim for free reverse geocoding (no API key required)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          
          let detectedCity = 'Bangalore'
          if (data && data.address) {
            detectedCity = data.address.city || data.address.state_district || data.address.county || data.address.state || 'Bangalore'
          }
          setCity(detectedCity)
          fetchWeather(detectedCity)
          setLocationStatus('')
        } catch (error) {
          console.error("Reverse geocoding failed", error)
          fetchWeather('Bangalore') // fallback
        }
      },
      (error) => {
        console.warn("Geolocation denied or failed", error)
        setLocationStatus('Location access denied. Using default.')
        setCity('Bangalore')
        fetchWeather('Bangalore')
      },
      { timeout: 10000 }
    )
  }

  // Detect location on initial mount
  useEffect(() => {
    detectLocation()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Smart <span className="gradient-text">Agri-Weather</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Real-time agricultural weather forecasts based on your GPS location.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search region..."
              className="input"
              style={{ width: 180 }}
            />
            <button onClick={() => fetchWeather(city)} className="btn btn-primary" style={{ padding: '10px 18px' }}>
              Search
            </button>
            <button 
              onClick={detectLocation} 
              className="btn btn-secondary" 
              style={{ padding: '10px', borderRadius: '50%' }}
              title="Detect My Location"
            >
              <PiNavigationArrowFill />
            </button>
          </div>
        </div>

        {loading || !weather ? (
          <div className="card animate-fade-in-up" style={{ padding: 64, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="spinner spinner-dark" style={{ width: 42, height: 42, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{locationStatus || 'Fetching local weather patterns...'}</p>
          </div>
        ) : (
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Current Weather Card */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden' }}>
              <PiCloudSunFill style={{ position: 'absolute', right: -40, top: -40, fontSize: '20rem', color: 'rgba(16,185,129,0.05)', zIndex: 0 }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-flex' }}>
                  <PiNavigationArrowFill /> {weather.city}, {weather.country}
                </span>
                <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {weather.temp}°C
                </h2>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: 8 }}>
                  {weather.condition} <span style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>(Feels like {weather.feelsLike}°C)</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '20px 24px', borderRadius: 16, boxShadow: 'var(--shadow-sm)', textAlign: 'center', minWidth: 120 }}>
                  <PiDropFill style={{ fontSize: '1.8rem', color: '#0ea5e9', marginBottom: 8 }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>HUMIDITY</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>{weather.humidity}%</p>
                </div>
                <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '20px 24px', borderRadius: 16, boxShadow: 'var(--shadow-sm)', textAlign: 'center', minWidth: 120 }}>
                  <PiWindFill style={{ fontSize: '1.8rem', color: '#6366f1', marginBottom: 8 }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>WIND SPEED</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>{weather.windSpeed}</p>
                </div>
                <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '20px 24px', borderRadius: 16, boxShadow: 'var(--shadow-sm)', textAlign: 'center', minWidth: 120 }}>
                  <PiSunFill style={{ fontSize: '1.8rem', color: '#f59e0b', marginBottom: 8 }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>UV INDEX</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>{weather.uvIndex} <span style={{fontSize: '0.8rem'}}>/ 10</span></p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {/* Smart Farming Advisories */}
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Farming Advisories
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {weather.farmingAdvisories.map((adv, idx) => (
                    <div key={idx} className="card" style={{ padding: 20, borderLeft: `4px solid ${adv.level === 'warning' ? '#ef4444' : adv.level === 'success' ? '#10b981' : '#3b82f6'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        {adv.level === 'warning' ? <PiWarningFill style={{ color: '#ef4444', fontSize: '1.2rem' }} /> : <PiCheckCircleFill style={{ color: '#10b981', fontSize: '1.2rem' }} />}
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{adv.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{adv.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7-Day Forecast */}
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  7-Day Outlook
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {weather.forecast.map((fc, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      background: 'var(--color-bg-elevated)', padding: '12px 20px', borderRadius: 12, border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <p style={{ fontWeight: 800, fontSize: '0.95rem', width: 40, color: 'var(--color-text)' }}>{fc.day}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500, width: 120 }}>{fc.condition}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <p style={{ fontSize: '0.85rem', color: '#0ea5e9', fontWeight: 700, width: 60, textAlign: 'right' }}>
                          <PiDropFill style={{ verticalAlign: 'middle', marginRight: 4 }}/>{fc.rainProb}
                        </p>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: 60, justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>{fc.tempHigh}°</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{fc.tempLow}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherDashboard
