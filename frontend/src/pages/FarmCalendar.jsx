import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PiArrowLeftBold,
  PiCalendarFill,
  PiPlusBold,
  PiCheckCircleFill,
  PiClockFill,
  PiPlantFill,
  PiDropFill,
  PiSparkleFill
} from 'react-icons/pi'

function FarmCalendar() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Apply Urea & NPK 19-19-19', category: 'Fertilization', crop: 'Paddy Field 1', date: '2026-08-06', status: 'Pending', icon: <PiSparkleFill /> },
    { id: '2', title: 'Schedule Drip Irrigation (45 mins)', category: 'Irrigation', crop: 'Tomato Plot B', date: '2026-08-05', status: 'Pending', icon: <PiDropFill /> },
    { id: '3', title: 'Neem Oil Spraying for Leaf Miners', category: 'Pesticide', crop: 'Tomato Plot B', date: '2026-08-08', status: 'Pending', icon: <PiPlantFill /> },
    { id: '4', title: 'Field Tilling & Bed Preparation', category: 'Preparation', crop: 'Wheat Field 2', date: '2026-08-02', status: 'Completed', icon: <PiCheckCircleFill /> },
  ])

  const [newTask, setNewTask] = useState({ title: '', category: 'Fertilization', crop: '', date: '' })

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTask.title) return
    const created = {
      id: Date.now().toString(),
      ...newTask,
      status: 'Pending',
      icon: <PiCalendarFill />
    }
    setTasks([created, ...tasks])
    setNewTask({ title: '', category: 'Fertilization', crop: '', date: '' })
  }

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 12px' }}>
              <PiArrowLeftBold /> Dashboard
            </Link>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>
                Farm Activity <span className="gradient-text">Calendar & Planner</span>
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                Schedule sowing, spraying, irrigation, and harvesting deadlines.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: 32, alignItems: 'start' }}>
          {/* Add Task Form */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <PiPlusBold style={{ color: 'var(--color-primary)' }} /> Schedule Task
            </h2>

            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g. Apply Bio-Fungicide"
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Category</label>
                <select value={newTask.category} onChange={(e) => setNewTask({...newTask, category: e.target.value})} className="input">
                  <option value="Fertilization">Fertilization</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Pesticide">Pesticide Spraying</option>
                  <option value="Sowing">Sowing / Planting</option>
                  <option value="Harvesting">Harvesting</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Target Field / Crop</label>
                <input
                  type="text"
                  value={newTask.crop}
                  onChange={(e) => setNewTask({...newTask, crop: e.target.value})}
                  placeholder="e.g. Tomato Plot A"
                  className="input"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Target Date</label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 8, padding: 12 }}>
                Add to Calendar
              </button>
            </form>
          </div>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)' }}>Upcoming Tasks</h2>
            {tasks.map(t => (
              <div key={t.id} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: t.status === 'Completed' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button
                    onClick={() => toggleStatus(t.id)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--color-primary)',
                      background: t.status === 'Completed' ? 'var(--color-primary)' : 'none',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {t.status === 'Completed' && <PiCheckCircleFill />}
                  </button>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', textDecoration: t.status === 'Completed' ? 'line-through' : 'none' }}>
                      {t.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {t.category} • {t.crop || 'General Field'}
                    </p>
                  </div>
                </div>
                <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                  <PiClockFill /> {t.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmCalendar
