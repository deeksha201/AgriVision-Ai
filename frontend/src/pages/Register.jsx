import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  PiUserFill,
  PiEnvelopeFill,
  PiLockKeyFill,
  PiEyeFill,
  PiEyeSlashFill,
  PiLeafFill,
  PiCheckCircleFill,
} from 'react-icons/pi'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: '', label: '', color: '' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 1) return { level: 'strength-weak', label: 'Weak', color: '#ef4444' }
    if (score <= 2) return { level: 'strength-fair', label: 'Fair', color: '#f59e0b' }
    if (score <= 3) return { level: 'strength-good', label: 'Good', color: '#10b981' }
    return { level: 'strength-strong', label: 'Strong', color: '#065f46' }
  }

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--gradient-hero)',
        padding: 24,
      }}>
        <div
          className="glass-strong animate-scale-in"
          style={{
            textAlign: 'center',
            padding: 48,
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: 400,
          }}
        >
          <PiCheckCircleFill style={{
            fontSize: '3.5rem',
            color: 'var(--color-primary-light)',
            marginBottom: 16,
          }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
            Account Created!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Redirecting you to login...
          </p>
        </div>
      </div>
    )
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
      <div className="blob blob-primary" style={{ width: 350, height: 350, top: -80, left: -80 }} />
      <div className="blob blob-accent" style={{ width: 250, height: 250, bottom: -60, right: -40 }} />

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
          Create Account
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          marginBottom: 32,
        }}>
          Join thousands of smart farmers today
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
          {/* Full Name */}
          <div style={{ position: 'relative' }}>
            <PiUserFill style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
            }} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              style={{ paddingLeft: 42 }}
              id="register-name"
            />
          </div>

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
              id="register-email"
            />
          </div>

          {/* Password */}
          <div>
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
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                style={{ paddingLeft: 42, paddingRight: 42 }}
                id="register-password"
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

            {/* Password strength indicator */}
            {password && (
              <div style={{ marginTop: 8 }}>
                <div className="strength-bar">
                  <div className={`strength-fill ${strength.level}`} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: strength.color,
                  marginTop: 4,
                  display: 'block',
                }}>
                  {strength.label}
                </span>
              </div>
            )}
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
            id="register-submit"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="spinner" /> Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          marginTop: 24,
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
