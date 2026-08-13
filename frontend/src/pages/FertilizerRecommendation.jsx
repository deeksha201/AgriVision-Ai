import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PiFlaskFill, PiArrowLeftBold, PiWarningCircleFill, PiPlantFill } from 'react-icons/pi'

import SearchableSelect from '../components/SearchableSelect'

const CROP_OPTIONS = [
  { value: 'Rice', label: 'Rice / Paddy (ಭತ್ತ)', icon: <PiPlantFill /> },
  { value: 'Wheat', label: 'Wheat (ಗೋಧಿ)', icon: <PiPlantFill /> },
  { value: 'Maize', label: 'Maize / Corn (ಮೆಕ್ಕೆಜೋಳ)', icon: <PiPlantFill /> },
  { value: 'Cotton', label: 'Cotton (ಹತ್ತಿ)', icon: <PiPlantFill /> },
  { value: 'Sugarcane', label: 'Sugarcane (ಕಬ್ಬು)', icon: <PiPlantFill /> },
  { value: 'Tomato', label: 'Tomato (ಟೊಮೆಟೊ)', icon: <PiPlantFill /> },
]

function FertilizerRecommendation() {
  const [formData, setFormData] = useState({
    soilType: 'Loamy Soil',
    cropType: 'Rice',
    nitrogen: 40,
    phosphorus: 25,
    potassium: 20,
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/fertilizer/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to calculate fertilizer dosage')
      }
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error communicating with fertilizer advisory server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
            <PiArrowLeftBold /> Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Fertilizer <span className="gradient-text">Advisor & Dosage Calculator</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Search crop options and calculate precise N-P-K nutrient deficiency solutions.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner animate-fade-in-down">
            <PiWarningCircleFill style={{ fontSize: '1.2rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <PiFlaskFill style={{ color: 'var(--color-primary-light)' }} /> Soil & Crop Inputs
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>
                  Soil Type
                </label>
                <select name="soilType" value={formData.soilType} onChange={handleChange} className="input">
                  <option value="Loamy Soil">Loamy Soil</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Black Soil">Black Cotton Soil</option>
                  <option value="Red Soil">Red Soil</option>
                </select>
              </div>

              {/* Searchable Crop Select */}
              <SearchableSelect
                label="Target Crop"
                options={CROP_OPTIONS}
                value={formData.cropType}
                onChange={(val) => setFormData({ ...formData, cropType: val })}
                placeholder="Search target crop..."
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Nitrogen (N)</label>
                  <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Phosphorus (P)</label>
                  <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Potassium (K)</label>
                  <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="input" required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 12, padding: 14 }}>
                {loading ? <span className="spinner" /> : 'Calculate Fertilizer Dosage'}
              </button>
            </form>
          </div>

          <div>
            {result ? (
              <div className="card-glass animate-scale-in" style={{ padding: 32 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: 16 }}>
                  Recommended Fertilizer Schedule
                </h2>

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <span className="badge badge-primary">Soil: {result.soilType}</span>
                  <span className="badge badge-accent">Crop: {result.cropType}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ background: 'var(--color-bg-elevated)', padding: 20, borderRadius: 12, border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{rec.primaryFertilizer}</h4>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec4899', background: '#ec489912', padding: '4px 10px', borderRadius: 20 }}>
                          Dosage: {rec.dosage}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        <strong>Application Timing:</strong> {rec.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 350 }}>
                <PiFlaskFill style={{ fontSize: '3rem', color: 'rgba(6,95,70,0.2)', marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  No Calculation Generated
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: 280 }}>
                  Enter your current soil N-P-K levels on the left to calculate required fertilizer dosage.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FertilizerRecommendation
