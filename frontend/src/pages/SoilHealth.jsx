import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowLeftBold,
  PiFlaskFill,
  PiCheckCircleFill,
  PiWarningFill,
  PiLeafFill,
  PiWarningCircleFill,
  PiInfoFill
} from 'react-icons/pi'

function SoilHealth() {
  const [formData, setFormData] = useState({
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    organicCarbon: 0.65
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/soil-health/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Soil analysis failed')
      }
      setResult(json.data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Network error analyzing soil metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleAnalyze()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAnalyze()
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
                Soil Health <span className="gradient-text">Score & Transparent Analysis</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Input lab test metrics to view a 100-point Soil Quality Index with metric-by-metric scoring breakdown.
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
          {/* Input Form */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <PiFlaskFill style={{ color: 'var(--color-primary)' }} /> Lab Test Metrics
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Nitrogen (N in kg/ha)</label>
                <input type="number" value={formData.nitrogen} onChange={(e) => setFormData({...formData, nitrogen: e.target.value})} className="input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Phosphorus (P in kg/ha)</label>
                <input type="number" value={formData.phosphorus} onChange={(e) => setFormData({...formData, phosphorus: e.target.value})} className="input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Potassium (K in kg/ha)</label>
                <input type="number" value={formData.potassium} onChange={(e) => setFormData({...formData, potassium: e.target.value})} className="input" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Soil pH</label>
                  <input type="number" step="0.1" value={formData.ph} onChange={(e) => setFormData({...formData, ph: e.target.value})} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Organic Carbon (%)</label>
                  <input type="number" step="0.01" value={formData.organicCarbon} onChange={(e) => setFormData({...formData, organicCarbon: e.target.value})} className="input" required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8, padding: 12 }}>
                {loading ? <span className="spinner" /> : 'Analyze Soil Index'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <div className="card-glass animate-scale-in" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span className="badge badge-primary">Soil Quality Rating</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {result.rating}
                  </span>
                </div>

                <div style={{ background: 'var(--color-bg-elevated)', padding: 24, borderRadius: 16, border: '1px solid var(--color-border)', textAlign: 'center', marginBottom: 24 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>OVERALL SOIL HEALTH SCORE</p>
                  <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: result.score >= 75 ? 'var(--color-primary)' : '#f59e0b', lineHeight: 1, marginTop: 6 }}>
                    {result.score} <span style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>/ 100</span>
                  </h2>
                </div>

                {/* Score Breakdown Transparency */}
                <div style={{ background: 'var(--color-bg-elevated)', padding: 16, borderRadius: 12, border: '1px solid var(--color-border)', marginBottom: 24 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PiInfoFill style={{ color: 'var(--color-primary)' }} /> Score Deduction Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                      <span>Base Perfect Score:</span>
                      <strong style={{ color: '#10b981' }}>100 pts</strong>
                    </div>
                    {result.scoreBreakdown && result.scoreBreakdown.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: item.deduction > 0 ? '#ef4444' : 'var(--color-text-secondary)' }}>
                        <span>• {item.label}:</span>
                        <strong>{item.deduction > 0 ? `-${item.deduction} pts` : 'No deduction (Optimal)'}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 24 }}>
                  <div style={{ background: 'var(--color-bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>NITROGEN</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{result.metrics.nitrogen.value}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: result.metrics.nitrogen.status === 'Optimal' ? '#10b981' : '#ef4444' }}>{result.metrics.nitrogen.status}</span>
                  </div>
                  <div style={{ background: 'var(--color-bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>PHOSPHORUS</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{result.metrics.phosphorus.value}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: result.metrics.phosphorus.status === 'Optimal' ? '#10b981' : '#ef4444' }}>{result.metrics.phosphorus.status}</span>
                  </div>
                  <div style={{ background: 'var(--color-bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>POTASSIUM</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{result.metrics.potassium.value}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: result.metrics.potassium.status === 'Optimal' ? '#10b981' : '#ef4444' }}>{result.metrics.potassium.status}</span>
                  </div>
                  <div style={{ background: 'var(--color-bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SOIL PH</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{result.metrics.ph.value}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: result.metrics.ph.status === 'Optimal' ? '#10b981' : '#ef4444' }}>{result.metrics.ph.status}</span>
                  </div>
                  <div style={{ background: 'var(--color-bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ORGANIC C</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{result.metrics.organicCarbon.value}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: result.metrics.organicCarbon.status === 'Good' ? '#10b981' : '#ef4444' }}>{result.metrics.organicCarbon.status}</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12, color: 'var(--color-text)' }}>Corrective Recommendations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ background: 'var(--color-bg-elevated)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <PiLeafFill style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <PiFlaskFill style={{ fontSize: '3rem', color: 'rgba(16,185,129,0.2)', marginBottom: 16 }} />
                <p>Input your soil lab metrics on the left to calculate your transparent score.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoilHealth
