import { useState } from 'react'
import {
  PiBellFill,
  PiXBold,
  PiCloudRainFill,
  PiTrendUpFill,
  PiCalendarFill,
  PiSparkleFill,
  PiCheckBold,
  PiTrashBold
} from 'react-icons/pi'

function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    { id: '1', icon: <PiCloudRainFill style={{ color: '#0ea5e9' }} />, title: 'Heavy Rain Warning', text: 'Heavy rainfall expected on Thursday. Delay spraying and hold off irrigation.', time: '10 mins ago', read: false },
    { id: '2', icon: <PiTrendUpFill style={{ color: '#10b981' }} />, title: 'Rice Price Surge', text: 'Paddy / Rice Mandi price surged +2.4% today reaching ₹2,450 / Qtl.', time: '1 hour ago', read: false },
    { id: '3', icon: <PiCalendarFill style={{ color: '#6366f1' }} />, title: 'Task Reminder', text: 'Urea & NPK fertilization scheduled for Paddy Field 1 tomorrow.', time: '3 hours ago', read: false },
    { id: '4', icon: <PiSparkleFill style={{ color: '#f59e0b' }} />, title: 'System Update', text: 'Voice Assistant & Soil Index breakdown tools are now active!', time: '1 day ago', read: true }
  ])

  if (!isOpen) return null

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="card animate-fade-in-down" style={{
        width: 380,
        height: '100vh',
        borderRadius: 0,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PiBellFill style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)' }}>Notifications</h3>
            {unreadCount > 0 && (
              <span className="badge badge-accent" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
            <PiXBold />
          </button>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '4px 8px', marginBottom: 16, alignSelf: 'flex-end', color: 'var(--color-primary)' }}>
            <PiCheckBold /> Mark all as read
          </button>
        )}

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px 0', fontSize: '0.9rem' }}>
              No notifications remaining
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{
                padding: 16,
                borderRadius: 12,
                background: n.read ? 'var(--color-bg-elevated)' : 'rgba(16,185,129,0.06)',
                border: `1px solid ${n.read ? 'var(--color-border)' : 'rgba(16,185,129,0.2)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem' }}>{n.icon}</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text)' }}>{n.title}</h4>
                  </div>
                  <button
                    onClick={() => dismissNotification(n.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                    title="Dismiss"
                  >
                    <PiTrashBold />
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{n.text}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', alignSelf: 'flex-end' }}>{n.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationDrawer
