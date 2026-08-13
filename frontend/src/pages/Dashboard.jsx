import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  PiLeafFill,
  PiHouseFill,
  PiPlantFill,
  PiMagnifyingGlassFill,
  PiChartLineUpFill,
  PiFlaskFill,
  PiCloudSunFill,
  PiStorefrontFill,
  PiUserFill,
  PiSignOutFill,
  PiListBold,
  PiXBold,
  PiLightningFill,
  PiCalendarFill,
  PiTrendUpFill,
  PiBellFill,
  PiChatCircleTextFill,
  PiShareFatFill,
  PiSunFill,
  PiMoonFill,
  PiDesktopFill,
  PiArrowRightBold,
  PiCloudRainFill
} from 'react-icons/pi'
import ShareModal from '../components/ShareModal'
import NotificationDrawer from '../components/NotificationDrawer'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleThemeMode = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  // Dashboard Chart 1: Crop Yield Overview
  const barChartData = {
    labels: ['Paddy / Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Tomato'],
    datasets: [
      {
        label: 'Expected Yield (Tons / Acre)',
        data: [1.8, 1.6, 2.2, 0.8, 35.0, 12.0],
        backgroundColor: resolvedTheme === 'dark' ? '#34d399' : '#10b981',
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: resolvedTheme === 'dark' ? '#0f172a' : '#1e293b',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' },
      },
      x: {
        grid: { display: false },
        ticks: { color: resolvedTheme === 'dark' ? '#cbd5e1' : '#334155' },
      },
    },
  }

  // Dashboard Chart 2: Monthly Revenue Trend
  const lineChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        fill: true,
        label: 'Revenue Trend (₹)',
        data: [42000, 58000, 51000, 74000, 89000, 95000],
        borderColor: '#6366f1',
        backgroundColor: resolvedTheme === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      },
    ],
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: resolvedTheme === 'dark' ? '#0f172a' : '#1e293b',
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (ctx) => `Revenue: ₹${ctx.parsed.y.toLocaleString('en-IN')}` },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: {
          color: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b',
          callback: (val) => `₹${val / 1000}k`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: resolvedTheme === 'dark' ? '#cbd5e1' : '#334155' },
      },
    },
  }

  const quickNavLinks = [
    { icon: <PiPlantFill />, title: 'Crop Rec.', to: '/crop-recommendation', color: '#10b981' },
    { icon: <PiMagnifyingGlassFill />, title: 'Disease AI', to: '/disease-detection', color: '#f59e0b' },
    { icon: <PiChartLineUpFill />, title: 'Yield AI', to: '/yield-prediction', color: '#6366f1' },
    { icon: <PiFlaskFill />, title: 'Fertilizer', to: '/fertilizer-recommendation', color: '#ec4899' },
    { icon: <PiCloudSunFill />, title: 'Weather', to: '/weather', color: '#0ea5e9' },
    { icon: <PiStorefrontFill />, title: 'Mandi Rates', to: '/market-prices', color: '#8b5cf6' },
    { icon: <PiChatCircleTextFill />, title: 'Voice Chat', to: '/crop-soil-chat', color: '#14b8a6' },
    { icon: <PiLightningFill />, title: 'Schemes', to: '/schemes', color: '#eab308' },
    { icon: <PiTrendUpFill />, title: 'Expenses', to: '/expenses', color: '#ef4444' },
    { icon: <PiCloudSunFill />, title: 'Irrigation', to: '/irrigation', color: '#0284c7' },
    { icon: <PiFlaskFill />, title: 'Soil Index', to: '/soil-health', color: '#16a34a' },
    { icon: <PiCalendarFill />, title: 'Calendar', to: '/calendar', color: '#6366f1' },
  ]

  const sidebarLinks = [
    { icon: <PiHouseFill />, label: 'Dashboard', to: '/dashboard' },
    { icon: <PiPlantFill />, label: 'Crop Recommendation', to: '/crop-recommendation' },
    { icon: <PiMagnifyingGlassFill />, label: 'Disease Detection', to: '/disease-detection' },
    { icon: <PiChartLineUpFill />, label: 'Yield Prediction', to: '/yield-prediction' },
    { icon: <PiFlaskFill />, label: 'Fertilizer Advisor', to: '/fertilizer-recommendation' },
    { icon: <PiCloudSunFill />, label: 'Weather', to: '/weather' },
    { icon: <PiStorefrontFill />, label: 'Market Prices', to: '/market-prices' },
    { icon: <PiChatCircleTextFill />, label: 'Crop & Soil Chat', to: '/crop-soil-chat' },
    { icon: <PiLightningFill />, label: 'Government Schemes', to: '/schemes' },
    { icon: <PiTrendUpFill />, label: 'Expense Tracker', to: '/expenses' },
    { icon: <PiCloudSunFill />, label: 'Smart Irrigation', to: '/irrigation' },
    { icon: <PiFlaskFill />, label: 'Soil Health Score', to: '/soil-health' },
    { icon: <PiCalendarFill />, label: 'Farm Calendar', to: '/calendar' },
    { icon: <PiUserFill />, label: 'My Profile', to: '/profile' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 35,
            display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '24px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.15rem',
          }}>
            <PiLeafFill style={{ color: '#34d399', fontSize: '1.3rem' }} />
            AgriVision AI
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="mobile-close"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            <PiXBold />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {sidebarLinks.map((link, index) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={index}
                to={link.to}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <PiSignOutFill style={{ fontSize: '1.1rem' }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                fontSize: '1.4rem',
                color: 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              <PiListBold />
            </button>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontWeight: 800,
                color: 'var(--color-text)',
              }}>
                Welcome back, <span className="gradient-text">{user?.name || 'Farmer'}</span>
              </h1>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                marginTop: 4,
              }}>
                Here's your real-time analytics & smart farming dashboard
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
              title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
            >
              {theme === 'light' && <><PiSunFill style={{ color: '#f59e0b' }} /> Light Mode</>}
              {theme === 'dark' && <><PiMoonFill style={{ color: '#818cf8' }} /> Dark Mode</>}
              {theme === 'system' && <><PiDesktopFill style={{ color: '#10b981' }} /> System Theme</>}
            </button>

            {/* Share App Button */}
            <button 
              onClick={() => setShareOpen(true)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600 }}
              title="Share Website"
            >
              <PiShareFatFill style={{ color: 'var(--color-primary)' }} /> Share
            </button>

            {/* Notification Drawer Trigger */}
            <button
              onClick={() => setNotificationsOpen(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                fontSize: '1.1rem',
                position: 'relative',
              }}
              title="Notifications"
            >
              <PiBellFill />
              <span style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
              }} />
            </button>

            {/* Profile Navigation Avatar */}
            <Link
              to="/profile"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Edit Profile"
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          <SummaryCard
            icon={<PiLightningFill />}
            label="AI Predictions"
            value="14"
            change="+3 this week"
            color="#10b981"
          />
          <SummaryCard
            icon={<PiCloudRainFill />}
            label="Active Season (ಋತು)"
            value="ಮಳೆಗಾಲ — Kharif"
            change="Jun - Oct (Monsoon)"
            color="#f59e0b"
          />
          <SummaryCard
            icon={<PiTrendUpFill />}
            label="Yield Efficiency"
            value="89%"
            change="+5% from last season"
            color="#6366f1"
          />
        </div>

        {/* Dashboard Charts (Replacing Quick Actions grid) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24,
          marginBottom: 32,
        }}>
          {/* Chart 1: Crop Yield Overview */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <PiPlantFill style={{ color: 'var(--color-primary)' }} /> Regional Crop Yield Benchmarks
            </h3>
            <div style={{ height: 250 }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Chart 2: Revenue Trend */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <PiTrendUpFill style={{ color: '#6366f1' }} /> Monthly Revenue Trend (₹)
            </h3>
            <div style={{ height: 250 }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Compact Quick Feature Navigation Bar */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: 16,
            color: 'var(--color-text)',
          }}>
            Quick Feature Access
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 12,
          }}>
            {quickNavLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="card"
                style={{
                  padding: '14px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 200ms',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${item.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: item.color,
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: 16,
            color: 'var(--color-text)',
          }}>
            Recent Activity Log
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <ActivityItem
              icon={<PiPlantFill />}
              title="Crop recommendation scan completed"
              time="Just now"
              color="#10b981"
            />
            <ActivityItem
              icon={<PiMagnifyingGlassFill />}
              title="Disease scan — No fungal pathogens detected"
              time="2 hours ago"
              color="#f59e0b"
              border
            />
            <ActivityItem
              icon={<PiChartLineUpFill />}
              title="Yield & Revenue prediction model updated"
              time="Yesterday"
              color="#6366f1"
              border
            />
          </div>
        </div>
      </main>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-overlay { display: block !important; }
          .mobile-close { display: block !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  )
}

function SummaryCard({ icon, label, value, change, color }) {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-md)',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: color,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 4 }}>
          {label}
        </p>
        <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.2 }}>
          {value}
        </p>
        <p style={{ fontSize: '0.75rem', color: color, fontWeight: 600, marginTop: 4 }}>
          {change}
        </p>
      </div>
    </div>
  )
}

function ActivityItem({ icon, title, time, color, border }) {
  return (
    <div style={{
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      borderTop: border ? '1px solid var(--color-border)' : 'none',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        color: color,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-text)' }}>{title}</p>
      </div>
      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
        {time}
      </span>
    </div>
  )
}

export default Dashboard
