import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowLeftBold,
  PiDropFill,
  PiCloudRainFill,
  PiWarningFill,
  PiCheckCircleFill,
  PiClockFill,
  PiWarningCircleFill,
  PiPlantFill
} from 'react-icons/pi'

const CROP_OPTIONS = [
  { value: 'Tomato', label: 'Tomato' },
  { value: 'Paddy / Rice', label: 'Paddy / Rice' },
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Maize', label: 'Maize / Corn' },
  { value: 'Cotton', label: 'Cotton' },
  { value: 'Sugarcane', label: 'Sugarcane' },
]

function SmartIrrigation() {
  const [formData, setFormData] = useState({
    crop: 'Tomato',
    soilType: 'Loamy Soil',
    growthStage: 'Vegetative',
    recentRainfall: 0
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAdvice = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/irrigation/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to generate irrigation advice')
      }
      setResult(json.data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Server connection error for Smart Irrigation')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvice()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchAdvice()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Smart <span className="gradient-text">Irrigation Advisor</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Calculate optimal watering schedules, soil retention targets, and rain-delay alerts.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-banner animate-fade-in-down">
            <PiWarningCircleFill style={{ fontSize: '1.2rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {/* Controls */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <PiDropFill style={{ color: '#0ea5e9' }} /> Field Parameters
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Select Crop</label>
                <select value={formData.crop} onChange={(e) => setFormData({...formData, crop: e.target.value})} className="input">
                  {CROP_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Soil Texture</label>
                <select value={formData.soilType} onChange={(e) => setFormData({...formData, soilType: e.target.value})} className="input">
                  <option value="Loamy Soil">Loamy Soil (Ideal Retention)</option>
                  <option value="Sandy Soil">Sandy Soil (Fast Draining)</option>
                  <option value="Clay Soil">Clay Soil (High Retention)</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Crop Growth Stage</label>
                <select value={formData.growthStage} onChange={(e) => setFormData({...formData, growthStage: e.target.value})} className="input">
                  <option value="Initial / Seedling">Initial / Seedling</option>
                  <option value="Vegetative">Vegetative Growth</option>
                  <option value="Flowering">Flowering & Pod Formation</option>
                  <option value="Maturation / Harvest">Maturation / Ripening</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Recent Rainfall (Last 24 Hours in mm)</label>
                <input
                  type="number"
                  value={formData.recentRainfall}
                  onChange={(e) => setFormData({...formData, recentRainfall: e.target.value})}
                  placeholder="0"
                  className="input"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8, padding: 12 }}>
                {loading ? <span className="spinner" /> : 'Calculate Schedule'}
              </button>
            </form>
          </div>

          {/* Results View */}
          <div>
            {result ? (
              <div className="card-glass animate-scale-in" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span className={`badge ${result.delayRain ? 'badge-accent' : 'badge-primary'}`}>
                    {result.delayRain ? <PiWarningFill /> : <PiCheckCircleFill />} {result.status}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Target: {result.soilMoistureTarget}
                  </span>
                </div>

                <div style={{ background: 'var(--color-bg-elevated)', padding: 20, borderRadius: 16, border: '1px solid var(--color-border)', marginBottom: 24 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>RECOMMENDED WATER VOLUME</p>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0ea5e9', lineHeight: 1.1, marginTop: 4 }}>
                    {result.recommendedVolume}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                    Frequency: <strong>{result.recommendedFrequency}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(14,165,233,0.08)', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid rgba(14,165,233,0.2)' }}>
                  <PiClockFill style={{ fontSize: '1.5rem', color: '#0ea5e9', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>NEXT WATERING SESSION</p>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#0c4a6e' }}>{result.nextWateringTime}</p>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-text)' }}>Agronomic Guidance</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.advisories.map((adv, idx) => (
                    <div key={idx} style={{ background: 'var(--color-bg-elevated)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <PiPlantFill style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <PiCloudRainFill style={{ fontSize: '3rem', color: 'rgba(14,165,233,0.2)', marginBottom: 16 }} />
                <p>Select field parameters on the left to calculate your customized irrigation plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartIrrigation
