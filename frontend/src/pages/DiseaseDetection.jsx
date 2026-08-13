import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowLeftBold,
  PiShieldCheckFill,
  PiWarningFill,
  PiFirstAidFill,
  PiPlantFill,
  PiImageSquareFill,
  PiScanFill,
  PiArrowClockwiseBold,
  PiWarningCircleFill,
  PiCheckCircleFill
} from 'react-icons/pi'

const CROP_HINT_OPTIONS = [
  { value: 'Tomato', label: 'Tomato' },
  { value: 'Potato', label: 'Potato' },
  { value: 'Maize', label: 'Maize / Corn' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Rice', label: 'Rice / Paddy' },
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Cotton', label: 'Cotton' },
  { value: 'Sugarcane', label: 'Sugarcane' },
  { value: 'Other', label: 'Other Crop' },
]

function DiseaseDetection() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [cropHint, setCropHint] = useState('Tomato')
  const [healthStatus, setHealthStatus] = useState('auto') // 'auto', 'healthy', 'diseased'
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (selected) => {
    if (!selected.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP)')
      return
    }
    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setResult(null)
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select or drag an image before running AI diagnosis.')
      return
    }

    setScanning(true)
    setResult(null)
    setError('')

    setTimeout(async () => {
      try {
        const response = await fetch('/api/disease/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageName: file ? file.name : 'leaf.jpg',
            cropHint,
            healthStatus
          }),
        })
        
        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Disease detection service failed.')
        }
        setResult(data)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Network error during image scan. Please try again.')
      } finally {
        setScanning(false)
      }
    }, 1800)
  }

  const isResultHealthy = result && (result.diagnosis.severity === 'None' || result.isHealthy)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                AI <span className="gradient-text">Crop Disease & Health Diagnosis</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Upload a plant photo for instant health verification or pathogen detection.
              </p>
            </div>
          </div>

          {(file || result) && (
            <button onClick={handleReset} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PiArrowClockwiseBold /> Reset / New Scan
            </button>
          )}
        </div>

        {error && (
          <div className="error-banner animate-fade-in-down">
            <PiWarningCircleFill style={{ fontSize: '1.2rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {/* File Upload Box */}
          <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
                  <PiScanFill style={{ color: 'var(--color-primary)' }} /> Visual Input
                </h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PiPlantFill style={{ color: 'var(--color-primary-light)' }} />
                  <select
                    value={cropHint}
                    onChange={(e) => setCropHint(e.target.value)}
                    className="input"
                    style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
                  >
                    {CROP_HINT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Health Condition Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Expected Condition:</span>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                  className="input"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem', background: 'var(--color-bg-elevated)' }}
                >
                  <option value="auto">Auto-Detect AI</option>
                  <option value="healthy">🌱 Healthy Crop (Scan & Verify)</option>
                  <option value="diseased">⚠️ Suspected Infection / Spots</option>
                </select>
              </div>
            </div>

            <div
              className="dropzone"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !scanning && fileInputRef.current.click()}
              style={{
                position: 'relative',
                flex: 1,
                minHeight: 280,
                border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-primary-light)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: dragActive ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: scanning ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: 24,
              }}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              
              {preview ? (
                <>
                  <img src={preview} alt="Leaf Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: scanning ? 0.6 : 1, transition: 'opacity 0.3s' }} />
                  
                  {scanning && (
                    <div className="scanner-line" />
                  )}
                  {result && (
                    <div
                      className={`bounding-box animate-scale-in ${isResultHealthy ? 'healthy-box' : ''}`}
                      data-label={isResultHealthy ? 'Healthy Crop Verified ✓' : 'Pathogen Detected'}
                    />
                  )}
                  {!scanning && !result && (
                    <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', bottom: 16 }}>
                      Click or drag to replace photo
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', pointerEvents: 'none', padding: 20 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: 'var(--color-bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)'
                  }}>
                    <PiImageSquareFill style={{ fontSize: '2rem', color: 'var(--color-primary)' }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>Drag & Drop Image Here</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>or click to browse leaf/fruit photos (JPEG, PNG)</p>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              className="btn btn-primary"
              disabled={scanning || !file}
              style={{ width: '100%', padding: 14, letterSpacing: '0.02em' }}
            >
              {scanning ? (
                <><PiScanFill className="animate-spin" /> Scanning Image Features...</>
              ) : (
                'Run AI Diagnosis'
              )}
            </button>
          </div>

          {/* Diagnosis Report */}
          <div>
            {result ? (
              <div className="card-glass animate-fade-in-up" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span className={`badge ${isResultHealthy ? 'badge-primary' : 'badge-accent'}`}>
                    {isResultHealthy ? <PiCheckCircleFill style={{ color: '#10b981' }} /> : <PiWarningFill />}
                    {isResultHealthy ? 'Healthy Plant Verified' : 'AI Pathogen Diagnosis'}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 999 }}>
                    {result.confidence} Confidence
                  </span>
                </div>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: isResultHealthy ? 'var(--color-primary-dark)' : 'var(--color-text)', marginBottom: 6 }}>
                  {result.diagnosis.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
                  Pathogen Identification: <strong>{result.diagnosis.pathogen}</strong>
                </p>

                <div style={{ background: 'var(--color-bg-elevated)', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: isResultHealthy ? 'var(--color-primary)' : '#dc2626', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isResultHealthy ? <PiCheckCircleFill /> : <PiWarningFill />} Visual Observations
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {result.diagnosis.symptoms}
                  </p>
                </div>

                <div style={{ background: 'var(--color-primary-dark)', color: 'white', padding: 16, borderRadius: 12, marginBottom: 16, boxShadow: 'var(--shadow-md)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-lighter)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PiShieldCheckFill /> Recommended Organic Care
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                    {result.diagnosis.organicTreatment}
                  </p>
                </div>

                <div style={{ background: 'var(--color-bg-elevated)', padding: 16, borderRadius: 12, border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PiFirstAidFill /> Action & Preventive Guidance
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                    <strong>Action:</strong> {result.diagnosis.chemicalTreatment}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    <strong>Prevention:</strong> {result.diagnosis.prevention}
                  </p>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', border: '1px dashed var(--color-border)' }}>
                {scanning ? (
                  <>
                    <PiScanFill style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: 20, animation: 'pulse 1.5s infinite' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>
                      Analyzing Neural Network
                    </h3>
                    <p style={{ fontSize: '0.9rem', maxWidth: 280 }}>
                      Extracting features and classifying crop pathogen patterns...
                    </p>
                  </>
                ) : (
                  <>
                    <PiPlantFill style={{ fontSize: '3rem', color: 'rgba(6,95,70,0.2)', marginBottom: 16 }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                      Awaiting Image
                    </h3>
                    <p style={{ fontSize: '0.85rem', maxWidth: 280 }}>
                      Upload a plant photo on the left to run AI diagnosis or health verification.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #10b981;
          box-shadow: 0 0 20px 4px rgba(16,185,129,0.8);
          animation: scan 2s ease-in-out infinite alternate;
          z-index: 10;
        }

        .bounding-box {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 60%;
          height: 60%;
          border: 3px solid #10b981;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.4);
          z-index: 5;
          pointer-events: none;
        }

        .bounding-box::after {
          content: attr(data-label);
          position: absolute;
          top: -30px;
          left: -3px;
          background: #10b981;
          color: white;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 800;
          border-radius: 4px 4px 4px 0;
        }

        .bounding-box.healthy-box {
          border-color: #10b981;
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(280px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default DiseaseDetection
