import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PiPlantFill,
  PiArrowLeftBold,
  PiSparkleFill,
  PiCheckCircleFill,
  PiInfoFill,
} from 'react-icons/pi'

function CropRecommendation() {
  const [formData, setFormData] = useState({
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    temperature: 24,
    humidity: 82,
    ph: 6.5,
    rainfall: 202,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/crops/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Recommendation failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
            <PiArrowLeftBold /> Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Crop <span className="gradient-text">Recommendation Engine</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Input soil nutrient levels and climate metrics to discover your highest yielding crop.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {/* Input Form */}
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <PiPlantFill style={{ color: 'var(--color-primary-light)' }} /> Soil & Environment Parameters
            </h2>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Nitrogen (N)
                  </label>
                  <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Phosphorus (P)
                  </label>
                  <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Potassium (K)
                  </label>
                  <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Temperature (°C)
                  </label>
                  <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Humidity (%)
                  </label>
                  <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} className="input" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Soil pH (0 - 14)
                  </label>
                  <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Rainfall (mm)
                  </label>
                  <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className="input" required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 12, padding: '14px' }}>
                {loading ? <span className="spinner" /> : <><PiSparkleFill /> Predict Ideal Crop</>}
              </button>
            </form>
          </div>

          {/* Results View */}
          <div>
            {result ? (
              <div className="card-glass animate-scale-in" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span className="badge badge-primary"><PiCheckCircleFill /> Top AI Recommendation</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => window.print()} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      📄 Download PDF Report
                    </button>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {result.topRecommendation.confidence}% Match
                    </span>
                  </div>
                </div>

                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 8 }}>
                  {result.topRecommendation.crop}
                </h2>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  {result.topRecommendation.tips}
                </p>

                <div style={{ background: 'var(--color-bg-elevated)', padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PiInfoFill style={{ color: 'var(--color-primary)' }} /> Ideal Environmental Ranges
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    <div><strong style={{ color: 'var(--color-text)' }}>Target N-P-K:</strong> {result.topRecommendation.idealRanges.nitrogen}</div>
                    <div><strong style={{ color: 'var(--color-text)' }}>Temperature:</strong> {result.topRecommendation.idealRanges.temperature}</div>
                    <div><strong style={{ color: 'var(--color-text)' }}>Soil pH:</strong> {result.topRecommendation.idealRanges.ph}</div>
                    <div><strong style={{ color: 'var(--color-text)' }}>Rainfall:</strong> {result.topRecommendation.idealRanges.rainfall}</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-text)' }}>Alternative Options</h4>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {result.alternativeCrops.map((alt, idx) => (
                    <div key={idx} style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid var(--color-border)', padding: '8px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {alt.crop} ({alt.confidence}%)
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 350 }}>
                <PiPlantFill style={{ fontSize: '3rem', color: 'rgba(6,95,70,0.2)', marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  No Prediction Generated Yet
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: 280 }}>
                  Adjust the soil & climate metrics on the left and click "Predict Ideal Crop".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropRecommendation
