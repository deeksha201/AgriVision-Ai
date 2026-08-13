import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowLeftBold,
  PiBankFill,
  PiMagnifyingGlassFill,
  PiArrowSquareOutBold,
  PiCheckCircleFill,
  PiShieldCheckFill
} from 'react-icons/pi'

function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/schemes?search=${search}&category=${category}`)
      const data = await res.json()
      if (data.success) setSchemes(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchemes()
  }, [category])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchSchemes()
  }

  const categories = ['All', 'Financial Support', 'Crop Insurance', 'Credit & Loans', 'Irrigation & Subsidy', 'Soil Testing', 'Machinery Subsidy']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Government <span className="gradient-text">Schemes & Subsidies</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Explore official agricultural subsidies, insurance schemes, and financial aid programs.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card" style={{ padding: 20, marginBottom: 32 }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
              <PiMagnifyingGlassFill style={{ position: 'absolute', left: 14, top: 14, color: 'var(--color-text-muted)', fontSize: '1.1rem' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scheme name, benefit, or keyword..."
                className="input"
                style={{ paddingLeft: 42 }}
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input" style={{ width: 'auto', minWidth: 180 }}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Search</button>
          </form>
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <span className="spinner spinner-dark" style={{ width: 36, height: 36, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading government schemes...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {schemes.map(scheme => (
              <div key={scheme.id} className="card animate-fade-in-up" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className="badge badge-primary">{scheme.badge}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{scheme.state}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8, lineHeight: 1.3 }}>
                    {scheme.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                    {scheme.description}
                  </p>

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 12, borderRadius: 10, marginBottom: 16 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: 2 }}>BENEFIT</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14532d' }}>{scheme.benefit}</p>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </div>
                </div>

                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.85rem' }}
                >
                  Official Portal <PiArrowSquareOutBold />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GovernmentSchemes
