import express from 'express'

const router = express.Router()

router.get('/stats', (req, res) => {
  try {
    const adminStats = {
      systemHealth: '100% Operational',
      totalUsers: 1420,
      activeFarmers: 1180,
      totalScansPerformed: 5840,
      marketSyncStatus: 'Synced 2 mins ago',
      registeredStates: 18,
      recentUsers: [
        { id: '101', name: 'Ramesh Patel', state: 'Gujarat', joined: '2026-08-04', status: 'Active' },
        { id: '102', name: 'Suresh Kumar', state: 'Karnataka', joined: '2026-08-03', status: 'Active' },
        { id: '103', name: 'Anik Dutta', state: 'Punjab', joined: '2026-08-03', status: 'Active' },
        { id: '104', name: 'Priya Sharma', state: 'Maharashtra', joined: '2026-08-02', status: 'Active' },
      ],
      scanMetrics: [
        { crop: 'Tomato', count: 2140 },
        { crop: 'Paddy', count: 1850 },
        { crop: 'Potato', count: 980 },
        { crop: 'Maize', count: 870 },
      ]
    }

    res.json({ success: true, data: adminStats })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' })
  }
})

export default router
