import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import {
  PiArrowLeftBold,
  PiCurrencyInrBold,
  PiPlusBold,
  PiTrashBold,
  PiTrendUpBold,
  PiTrendDownBold,
  PiWalletFill
} from 'react-icons/pi'

ChartJS.register(ArcElement, Tooltip, Legend)

function ExpenseTracker() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Seeds & Saplings',
    amount: '',
    crop: 'Paddy / Rice',
    notes: ''
  })

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses')
      const json = await res.json()
      if (json.success) setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount) return

    try {
      const res = await fetch('/api/expenses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (json.success) {
        setFormData({ type: 'expense', category: 'Seeds & Saplings', amount: '', crop: 'Paddy / Rice', notes: '' })
        fetchExpenses()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      fetchExpenses()
    } catch (err) {
      console.error(err)
    }
  }

  const chartData = {
    labels: data?.categoryBreakdown ? Object.keys(data.categoryBreakdown) : [],
    datasets: [{
      data: data?.categoryBreakdown ? Object.values(data.categoryBreakdown) : [],
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'],
      borderWidth: 0
    }]
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Farm <span className="gradient-text">Expense & Profit Tracker</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Track input costs, harvest income, and calculate exact net profit margins.
              </p>
            </div>
          </div>
        </div>

        {loading || !data ? (
          <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <span className="spinner spinner-dark" style={{ width: 36, height: 36, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading financial logs...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Top Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div className="card" style={{ padding: 24 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>TOTAL INCOME</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', marginTop: 4 }}>
                  ₹{data.summary.totalIncome.toLocaleString()}
                </h3>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>TOTAL EXPENSES</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444', marginTop: 4 }}>
                  ₹{data.summary.totalExpenses.toLocaleString()}
                </h3>
              </div>
              <div className="card-glass" style={{ padding: 24 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>NET PROFIT / LOSS</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: data.summary.netProfit >= 0 ? 'var(--color-primary-dark)' : '#dc2626', marginTop: 4 }}>
                  ₹{data.summary.netProfit.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>({data.summary.profitMargin}% Margin)</span>
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 32, alignItems: 'start' }}>
              {/* Add Log Form */}
              <div className="card" style={{ padding: 28 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PiPlusBold style={{ color: 'var(--color-primary)' }} /> Log Transaction
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input">
                      <option value="expense">🔴 Expense (Outflow)</option>
                      <option value="income">🟢 Income / Sale (Inflow)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input">
                      {formData.type === 'expense' ? (
                        <>
                          <option value="Seeds & Saplings">Seeds & Saplings</option>
                          <option value="Fertilizers">Fertilizers</option>
                          <option value="Labor Charges">Labor Charges</option>
                          <option value="Pesticides & Spraying">Pesticides & Spraying</option>
                          <option value="Tractor & Machinery Rental">Tractor & Machinery Rental</option>
                          <option value="Irrigation / Fuel">Irrigation / Fuel</option>
                        </>
                      ) : (
                        <>
                          <option value="Crop Harvest Sale">Crop Harvest Sale</option>
                          <option value="Government Subsidy">Government Subsidy</option>
                          <option value="Other Income">Other Income</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="e.g. 5000"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Crop / Field</label>
                    <input
                      type="text"
                      value={formData.crop}
                      onChange={(e) => setFormData({...formData, crop: e.target.value})}
                      placeholder="e.g. Paddy, Wheat"
                      className="input"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 8, padding: 12 }}>
                    Add Record
                  </button>
                </form>
              </div>

              {/* Transactions List & Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Category Breakdown Donut */}
                <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Expense Breakdown</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cost distribution across farming operations</p>
                  </div>
                  <div style={{ width: 140, height: 140 }}>
                    <Doughnut data={chartData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Log Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', fontWeight: 800 }}>
                    Recent Transactions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {data.transactions.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>{item.category}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.crop} • {item.date}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: item.type === 'income' ? '#10b981' : '#ef4444' }}>
                            {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                          </span>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-ghost" style={{ padding: 6, color: '#ef4444' }}>
                            <PiTrashBold />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseTracker
