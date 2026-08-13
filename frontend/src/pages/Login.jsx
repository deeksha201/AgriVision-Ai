import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PiEnvelopeFill, PiLockKeyFill, PiEyeFill, PiEyeSlashFill, PiLeafFill } from 'react-icons/pi'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-hero)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div className="blob blob-primary" style={{ width: 350, height: 350, top: -80, right: -80 }} />
      <div className="blob blob-accent" style={{ width: 250, height: 250, bottom: -60, left: -40 }} />

      <div
        className="glass-strong animate-scale-in"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 40,
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          textDecoration: 'none',
          marginBottom: 32,
        }}>
          <PiLeafFill style={{ fontSize: '1.8rem', color: 'var(--color-primary-light)' }} />
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
          }}>
            AgriVision AI
          </span>
        </Link>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: 8,
          color: 'var(--color-text)',
        }}>
          Welcome Back
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          marginBottom: 32,
        }}>
          Sign in to access your farming dashboard
        </p>

        {error && (
          <div
            className="animate-fade-in-down"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <PiEnvelopeFill style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
            }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              style={{ paddingLeft: 42 }}
              id="login-email"
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <PiLockKeyFill style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              style={{ paddingLeft: 42, paddingRight: 42 }}
              id="login-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: 0,
              }}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <PiEyeSlashFill /> : <PiEyeFill />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 8,
              padding: '14px 28px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            id="login-submit"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="spinner" /> Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          marginTop: 24,
        }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
