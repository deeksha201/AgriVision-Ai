import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  PiArrowLeftBold,
  PiUserFill,
  PiMapPinFill,
  PiPlantFill,
  PiRulerFill,
  PiCheckBold,
  PiFloppyDiskBold,
  PiWarningCircleFill
} from 'react-icons/pi'

function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [farmLocation, setFarmLocation] = useState(user?.farmLocation || '')
  const [farmSize, setFarmSize] = useState(user?.farmSize || '')
  const [primaryCrop, setPrimaryCrop] = useState(user?.primaryCrop || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          name,
          farmLocation,
          farmSize,
          primaryCrop
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile')
      }

      updateUser(data.user)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
            <PiArrowLeftBold /> Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Farmer <span className="gradient-text">Profile</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Manage your personal information, farm details, and regional parameters.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: 40 }}>
          {/* Avatar Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--color-border)' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-glow)'
            }}>
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)' }}>{name || 'Farmer'}</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{user?.email}</p>
              <span className="badge badge-primary" style={{ marginTop: 8 }}>
                <PiPlantFill /> Registered Farmer
              </span>
            </div>
          </div>

          {success && (
            <div className="animate-fade-in-down" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: 'var(--color-primary-dark)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <PiCheckBold /> {success}
            </div>
          )}

          {error && (
            <div className="error-banner animate-fade-in-down">
              <PiWarningCircleFill style={{ fontSize: '1.2rem' }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>
                  <PiUserFill style={{ color: 'var(--color-primary)' }} /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label style={labelStyle}>Email Address (Account ID)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              {/* Farm Location */}
              <div>
                <label style={labelStyle}>
                  <PiMapPinFill style={{ color: 'var(--color-primary)' }} /> Farm Location / District
                </label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="input"
                  placeholder="e.g. Mandya, Karnataka"
                />
              </div>

              {/* Farm Size */}
              <div>
                <label style={labelStyle}>
                  <PiRulerFill style={{ color: 'var(--color-primary)' }} /> Total Farm Land Area
                </label>
                <input
                  type="text"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="input"
                  placeholder="e.g. 5.5 Acres"
                />
              </div>

              {/* Primary Crop */}
              <div>
                <label style={labelStyle}>
                  <PiPlantFill style={{ color: 'var(--color-primary)' }} /> Primary Cultivated Crop
                </label>
                <input
                  type="text"
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="input"
                  placeholder="e.g. Paddy / Rice, Tomato"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '14px 28px', alignSelf: 'flex-start', marginTop: 12 }}
            >
              {loading ? (
                <><span className="spinner" /> Saving Changes...</>
              ) : (
                <><PiFloppyDiskBold /> Save Profile Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 6
}

export default ProfilePage
