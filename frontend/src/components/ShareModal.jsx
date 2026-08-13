import { useState } from 'react'
import {
  PiShareFatFill,
  PiXBold,
  PiCopyBold,
  PiCheckBold,
  PiWhatsappLogoFill,
  PiTelegramLogoFill,
  PiTwitterLogoFill,
  PiEnvelopeSimpleFill
} from 'react-icons/pi'

function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)
  if (!isOpen) return null

  const shareUrl = window.location.origin
  const shareTitle = 'AgriVision AI — Smart Farming & Agriculture Platform'
  const shareText = 'Check out AgriVision AI for real-time market prices, crop recommendations, yield prediction, and AI disease diagnosis!'

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.warn('Native share cancelled or failed', err)
      }
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div className="card animate-scale-in" style={{
        maxWidth: 440,
        width: '100%',
        padding: 28,
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: 4
          }}
        >
          <PiXBold />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#ecfdf5',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>
            <PiShareFatFill />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>Share AgriVision AI</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          Share this platform with fellow farmers, agronomists, and friends.
        </p>

        {/* Quick Social Share Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <a
            href={`https://api.whatsapp.com/send?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              padding: 12,
              borderRadius: 12,
              background: '#25D36615',
              color: '#25D366',
              fontWeight: 700,
              fontSize: '0.75rem',
              transition: 'transform 0.2s'
            }}
          >
            <PiWhatsappLogoFill style={{ fontSize: '1.8rem' }} />
            WhatsApp
          </a>

          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              padding: 12,
              borderRadius: 12,
              background: '#0088cc15',
              color: '#0088cc',
              fontWeight: 700,
              fontSize: '0.75rem',
              transition: 'transform 0.2s'
            }}
          >
            <PiTelegramLogoFill style={{ fontSize: '1.8rem' }} />
            Telegram
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              padding: 12,
              borderRadius: 12,
              background: '#1DA1F215',
              color: '#1DA1F2',
              fontWeight: 700,
              fontSize: '0.75rem',
              transition: 'transform 0.2s'
            }}
          >
            <PiTwitterLogoFill style={{ fontSize: '1.8rem' }} />
            Twitter
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              padding: 12,
              borderRadius: 12,
              background: '#6366f115',
              color: '#6366f1',
              fontWeight: 700,
              fontSize: '0.75rem',
              transition: 'transform 0.2s'
            }}
          >
            <PiEnvelopeSimpleFill style={{ fontSize: '1.8rem' }} />
            Email
          </a>
        </div>

        {/* Link Copy Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-bg)',
          padding: '8px 8px 8px 16px',
          borderRadius: 12,
          border: '1px solid var(--color-border)'
        }}>
          <span style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
            fontWeight: 500
          }}>
            {shareUrl}
          </span>
          <button
            onClick={copyToClipboard}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            {copied ? <><PiCheckBold /> Copied!</> : <><PiCopyBold /> Copy Link</>}
          </button>
        </div>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 12, padding: 12, fontSize: '0.85rem' }}
          >
            Use System Share Menu
          </button>
        )}
      </div>
    </div>
  )
}

export default ShareModal
