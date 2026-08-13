import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import {
  PiArrowLeftBold,
  PiTrendUpBold,
  PiTrendDownBold,
  PiMinusBold,
  PiClockFill
} from 'react-icons/pi'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

function MarketPrices() {
  const [commodities, setCommodities] = useState([])
  const [lastUpdated, setLastUpdated] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/market')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCommodities(data.data)
          setLastUpdated(new Date(data.timestamp).toLocaleString())
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getChartOptions = (isPositive) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#1e293b',
        titleFont: { size: 11 },
        bodyFont: { size: 12, weight: 'bold' },
        padding: 8,
        displayColors: false,
        callbacks: {
          title: (items) => `Day -${6 - items[0].dataIndex}`,
          label: (item) => `₹${item.parsed.y} / Qtl`
        }
      }
    },
    scales: {
      x: { display: false },
      y: { display: false, min: 'auto' } // auto scale for sparkline
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
      line: {
        tension: 0.4,
        borderWidth: 2.5,
        borderColor: isPositive ? '#10b981' : '#ef4444',
      }
    }
  })

  // Group by category
  const grouped = commodities.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = []
    acc[curr.category].push(curr)
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Live <span className="gradient-text">Market Simulation</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Dynamic 24-hour price tracking and 7-day volatility trends across 22 commodities.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
              <PiClockFill /> Live Data Engine
            </span>
            {lastUpdated && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Synced: {lastUpdated}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 64, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="spinner spinner-dark" style={{ width: 36, height: 36, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Generating real-time market data...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 800, 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {category}
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                  {items.map((item) => {
                    const isPositive = item.percentChange >= 0
                    const trendIcon = isPositive ? <PiTrendUpBold /> : <PiTrendDownBold />
                    
                    const chartData = {
                      labels: ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'],
                      datasets: [{
                        data: item.trend,
                        borderColor: isPositive ? '#10b981' : '#ef4444',
                        backgroundColor: 'transparent',
                      }]
                    }

                    return (
                      <div key={item.id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ fontSize: '1.8rem' }}>{item.icon}</div>
                            <div>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                                {item.name}
                              </h3>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                Vol: {item.volume.toLocaleString()} {item.unit}s
                              </p>
                            </div>
                          </div>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: 20,
                              background: isPositive ? '#ecfdf5' : '#fef2f2',
                              color: isPositive ? '#10b981' : '#ef4444',
                              border: `1px solid ${isPositive ? '#a7f3d0' : '#fecaca'}`
                            }}
                          >
                            {trendIcon}
                            {isPositive ? '+' : ''}{item.percentChange}%
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                              Current Price
                            </p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1 }}>
                              ₹{item.currentPrice.toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                              per {item.unit}
                            </p>
                          </div>
                          
                          {/* Sparkline Chart */}
                          <div style={{ width: 120, height: 50 }}>
                            <Line data={chartData} options={getChartOptions(isPositive)} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketPrices
