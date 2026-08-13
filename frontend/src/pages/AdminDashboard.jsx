import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import {
  PiArrowLeftBold,
  PiShieldCheckFill,
  PiUsersFill,
  PiScanFill,
  PiGlobeFill,
  PiCheckCircleFill,
  PiSparkleFill
} from 'react-icons/pi'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(json => {
        if (json.success) setStats(json.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const chartData = {
    labels: stats?.scanMetrics ? stats.scanMetrics.map(m => m.crop) : [],
    datasets: [{
      label: 'Scans Performed',
      data: stats?.scanMetrics ? stats.scanMetrics.map(m => m.count) : [],
      backgroundColor: '#10b981',
      borderRadius: 8
    }]
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <PiArrowLeftBold /> Farmer View
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                <PiShieldCheckFill style={{ color: '#10b981' }} /> AgriVision <span style={{ color: '#10b981' }}>System Admin</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>
                Platform operations, registered farmers overview, and AI scan telemetry.
              </p>
            </div>
          </div>

          <span className="badge" style={{ background: '#064e3b', color: '#6ee7b7', border: '1px solid #047857' }}>
            <PiCheckCircleFill /> System Status: {stats?.systemHealth || '100% Operational'}
          </span>
        </div>

        {loading || !stats ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', background: '#1e293b', border: '1px solid #334155' }}>
            <span className="spinner spinner-dark" style={{ width: 36, height: 36, margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8' }}>Loading admin telemetry...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Top Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: 24, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <PiUsersFill style={{ fontSize: '1.5rem', color: '#10b981' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>TOTAL USERS</p>
                </div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white' }}>{stats.totalUsers.toLocaleString()}</h3>
                <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: 4 }}>{stats.activeFarmers} active farmers</p>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: 24, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <PiScanFill style={{ fontSize: '1.5rem', color: '#f59e0b' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>AI DIAGNOSIS SCANS</p>
                </div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white' }}>{stats.totalScansPerformed.toLocaleString()}</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Processed with 94.2% avg accuracy</p>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: 24, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <PiGlobeFill style={{ fontSize: '1.5rem', color: '#0ea5e9' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>STATES COVERED</p>
                </div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white' }}>{stats.registeredStates}</h3>
                <p style={{ fontSize: '0.8rem', color: '#0ea5e9', marginTop: 4 }}>Across major Indian APMC Mandis</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 380px)', gap: 32, alignItems: 'start' }}>
              {/* Registered Farmers Table */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', fontWeight: 800, fontSize: '1.1rem' }}>
                  Recent Registered Farmers
                </div>
                <div>
                  {stats.recentUsers.map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #334155' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{u.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>State: {u.state} • Joined {u.joined}</p>
                      </div>
                      <span style={{ background: '#064e3b', color: '#6ee7b7', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                        {u.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scan Metrics Chart */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', padding: 24, borderRadius: 16 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>Disease Scan Telemetry</h3>
                <div style={{ height: 260 }}>
                  <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
