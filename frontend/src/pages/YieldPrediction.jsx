import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  PiChartLineUpFill,
  PiArrowLeftBold,
  PiMapPinFill,
  PiPlantFill,
  PiDropFill,
  PiWarningCircleFill,
  PiSunFill,
  PiSnowflakeFill,
  PiCloudRainFill
} from 'react-icons/pi'

import SearchableSelect from '../components/SearchableSelect'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const CROP_OPTIONS = [
  { value: 'Rice', label: 'Rice / Paddy (ಭತ್ತ)', icon: <PiPlantFill /> },
  { value: 'Wheat', label: 'Wheat (ಗೋಧಿ)', icon: <PiPlantFill /> },
  { value: 'Maize', label: 'Maize / Corn (ಮೆಕ್ಕೆಜೋಳ)', icon: <PiPlantFill /> },
  { value: 'Cotton', label: 'Cotton (ಹತ್ತಿ)', icon: <PiPlantFill /> },
  { value: 'Sugarcane', label: 'Sugarcane (ಕಬ್ಬು)', icon: <PiPlantFill /> },
  { value: 'Tomato', label: 'Tomato (ಟೊಮೆಟೊ)', icon: <PiPlantFill /> },
  { value: 'Potato', label: 'Potato (ಆಲೂಗಡ್ಡೆ)', icon: <PiPlantFill /> },
  { value: 'Soybean', label: 'Soybean (ಸೋಯಾಬೀನ್)', icon: <PiPlantFill /> },
  { value: 'Groundnut', label: 'Groundnut (ಕಡಲೆಕಾಯಿ)', icon: <PiPlantFill /> },
  { value: 'Chickpea', label: 'Chickpea / Chana (ಕಡಲೆ)', icon: <PiPlantFill /> },
]

const SEASON_OPTIONS = [
  { value: 'Kharif', label: 'ಮಳೆಗಾಲ — Monsoon (Kharif)', icon: <PiCloudRainFill /> },
  { value: 'Rabi', label: 'ಚಳಿಗಾಲ — Winter (Rabi)', icon: <PiSnowflakeFill /> },
  { value: 'Zaid', label: 'ಬೇಸಿಗೆ — Summer (Zaid)', icon: <PiSunFill /> },
]

function YieldPrediction() {
  const [regions, setRegions] = useState([])
  const [formData, setFormData] = useState({
    crop: 'Rice',
    area: 5,
    season: 'Kharif',
    region: 'Karnataka',
    soilType: '',
  })
  const [availableSoils, setAvailableSoils] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Fetch regions on mount
  useEffect(() => {
    fetch('/api/yield/regions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegions(data.regions)
          const karnataka = data.regions.find(r => r.name === 'Karnataka')
          if (karnataka) {
            setAvailableSoils(karnataka.soils)
            setFormData(prev => ({ ...prev, soilType: karnataka.soils[0] }))
          }
        }
      })
      .catch(err => console.error(err))
  }, [])

  // Update soils when region changes
  const handleRegionChange = (e) => {
    const region = e.target.value
    const regionData = regions.find(r => r.name === region)
    const soils = regionData ? regionData.soils : []
    setAvailableSoils(soils)
    setFormData(prev => ({ ...prev, region, soilType: soils[0] || '' }))
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/yield/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Yield prediction failed')
      }
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error processing yield prediction')
    } finally {
      setLoading(false)
    }
  }

  // Chart configurations
  const barChartData = result ? {
    labels: result.charts.yieldComparison.labels,
    datasets: [{
      label: 'Yield (Tons)',
      data: result.charts.yieldComparison.datasets[0].data,
      backgroundColor: ['#10b981', '#6366f1', '#94a3b8'],
      borderRadius: 8,
      borderSkipped: false,
      barThickness: 48,
    }],
  } : null

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (ctx) => `${ctx.parsed.y} Tons` },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: { font: { size: 11, weight: '500' }, color: '#64748b' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: '600' }, color: '#334155' },
      },
    },
  }

  const doughnutChartData = result ? {
    labels: result.charts.revenueBreakdown.labels,
    datasets: [{
      data: result.charts.revenueBreakdown.datasets[0].data,
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  } : null

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, font: { size: 12, weight: '500' } },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (ctx) => `₹${ctx.parsed.toLocaleString('en-IN')}` },
      },
    },
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
            <PiArrowLeftBold /> Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Crop <span className="gradient-text">Yield & Revenue Predictor</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Select your region, soil type, and crop with Kannada-friendly season options.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner animate-fade-in-down">
            <PiWarningCircleFill style={{ fontSize: '1.2rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form + Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── Input Form ── */}
          <div className="card" style={{ padding: 32, position: 'sticky', top: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <PiMapPinFill style={{ color: 'var(--color-primary-light)' }} /> Region & Crop Parameters
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Region */}
              <div>
                <label style={labelStyle}>Region / State</label>
                <select name="region" value={formData.region} onChange={handleRegionChange} className="input">
                  {regions.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label style={labelStyle}>Soil Type</label>
                <select name="soilType" value={formData.soilType} onChange={handleChange} className="input">
                  {availableSoils.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Searchable Crop Select */}
              <SearchableSelect
                label="Select Crop"
                options={CROP_OPTIONS}
                value={formData.crop}
                onChange={(val) => setFormData({ ...formData, crop: val })}
                placeholder="Type to search crop..."
              />

              {/* Area */}
              <div>
                <label style={labelStyle}>Farm Area (Acres)</label>
                <input type="number" name="area" value={formData.area} onChange={handleChange} className="input" required min="0.5" step="0.5" />
              </div>

              {/* Kannada-Friendly Cropping Season Select */}
              <div>
                <label style={labelStyle}>Cropping Season (ಋತು / ಋತುಮಾನ)</label>
                <select name="season" value={formData.season} onChange={handleChange} className="input">
                  {SEASON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 12, padding: 14 }}>
                {loading ? <span className="spinner" /> : 'Predict Yield & Revenue'}
              </button>
            </form>
          </div>

          {/* ── Results Panel ── */}
          <div>
            {result ? (
              <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Summary Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  <SummaryCard
                    label="Total Yield"
                    value={`${result.predictions.totalYieldTons} Tons`}
                    subtext={`${result.predictions.totalYieldQuintals} Quintals`}
                    color="#10b981"
                  />
                  <SummaryCard
                    label="Gross Revenue"
                    value={result.predictions.grossRevenueFormatted}
                    subtext="Based on Mandi MSP"
                    color="#6366f1"
                  />
                  <SummaryCard
                    label="Net Profit"
                    value={result.predictions.netProfitFormatted}
                    subtext={`Cost: ${result.predictions.productionCostFormatted}`}
                    color={result.predictions.netProfitINR >= 0 ? '#10b981' : '#ef4444'}
                  />
                  <SummaryCard
                    label="Soil Match"
                    value={`${result.soilAnalysis.suitabilityScore}%`}
                    subtext={result.soilType}
                    color="#f59e0b"
                  />
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
                  {/* Bar Chart: Yield Comparison */}
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={chartTitleStyle}>
                      <PiChartLineUpFill style={{ color: '#6366f1' }} /> Yield Comparison
                    </h3>
                    <div style={{ height: 240 }}>
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                  </div>

                  {/* Doughnut Chart: Revenue Breakdown */}
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={chartTitleStyle}>
                      <PiChartLineUpFill style={{ color: '#10b981' }} /> Revenue Breakdown
                    </h3>
                    <div style={{ height: 240 }}>
                      <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                    </div>
                  </div>
                </div>

                {/* Soil Analysis */}
                <div className="card" style={{ padding: 24 }}>
                  <h3 style={{ ...chartTitleStyle, marginBottom: 20 }}>
                    <PiDropFill style={{ color: '#f59e0b' }} /> Soil Analysis — {result.soilType}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <SoilProperty label="Water Retention" value={result.soilAnalysis.waterRetention} />
                    <SoilProperty label="Fertility Level" value={result.soilAnalysis.fertility} />
                    <SoilProperty label="pH Range" value={result.soilAnalysis.phRange} />
                    <SoilProperty label="Organic Content" value={result.soilAnalysis.organicContent} />
                    <SoilProperty label="Texture" value={result.soilAnalysis.texture} />
                    <SoilProperty label="Crop-Soil Match" value={`${result.soilAnalysis.suitabilityScore}%`} />
                  </div>

                  {/* Soil Comparison for Region */}
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--color-text)' }}>
                    <PiPlantFill style={{ color: 'var(--color-primary-light)', marginRight: 6 }} />
                    {result.crop} Suitability Across {result.region} Soils
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.soilAnalysis.soilComparison.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: item.selected ? 700 : 500,
                          color: item.selected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          minWidth: 140,
                        }}>
                          {item.soil} {item.selected && '✓'}
                        </span>
                        <div style={{
                          flex: 1,
                          height: 10,
                          background: 'var(--color-border)',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${item.score}%`,
                            height: '100%',
                            borderRadius: 999,
                            background: item.selected
                              ? 'var(--gradient-primary)'
                              : item.score >= 70 ? '#10b981' : item.score >= 40 ? '#f59e0b' : '#ef4444',
                            transition: 'width 0.8s ease-out',
                          }} />
                        </div>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: item.score >= 70 ? '#10b981' : item.score >= 40 ? '#f59e0b' : '#ef4444',
                          minWidth: 36,
                          textAlign: 'right',
                        }}>
                          {item.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{
                padding: 64,
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
              }}>
                <PiChartLineUpFill style={{ fontSize: '3rem', color: 'rgba(6,95,70,0.2)', marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  No Prediction Generated
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: 300 }}>
                  Select your region, soil type, crop, and Kannada season name on the left panel to predict yield and profit graphs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 860px) {
          div[style*="gridTemplateColumns: minmax(300px, 380px)"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: 1.3fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ── Reusable Components ─────────────────────────────────────────────
const labelStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  display: 'block',
  marginBottom: 4,
}

const chartTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: 'var(--color-text)',
}

function SummaryCard({ label, value, subtext, color }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.5rem', fontWeight: 900, color, marginTop: 4, lineHeight: 1.2 }}>
        {value}
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
        {subtext}
      </p>
    </div>
  )
}

function SoilProperty({ label, value }) {
  return (
    <div style={{
      background: 'var(--color-bg)',
      padding: '12px 16px',
      borderRadius: 10,
      border: '1px solid var(--color-border)',
    }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>
        {value}
      </p>
    </div>
  )
}

export default YieldPrediction
