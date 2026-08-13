import express from 'express'

const router = express.Router()

// Simulated in-memory storage for farm expenses and earnings
let EXPENSES = [
  { id: '1', type: 'expense', category: 'Seeds & Saplings', amount: 12500, crop: 'Paddy / Rice', date: '2026-07-10', notes: 'High yield certified seeds' },
  { id: '2', type: 'expense', category: 'Fertilizers', amount: 8400, crop: 'Paddy / Rice', date: '2026-07-15', notes: 'Urea & NPK 19-19-19' },
  { id: '3', type: 'expense', category: 'Labor Charges', amount: 15000, crop: 'Paddy / Rice', date: '2026-07-20', notes: 'Transplanting labor' },
  { id: '4', type: 'expense', category: 'Pesticides & Spraying', amount: 3200, crop: 'Paddy / Rice', date: '2026-07-28', notes: 'Neem oil spray' },
  { id: '5', type: 'expense', category: 'Tractor & Machinery Rental', amount: 6500, crop: 'Paddy / Rice', date: '2026-07-05', notes: 'Field tilling' },
  { id: '6', type: 'income', category: 'Crop Harvest Sale', amount: 78500, crop: 'Paddy / Rice', date: '2026-08-01', notes: 'Sold 32 Quintals at Mandi' },
]

router.get('/', (req, res) => {
  try {
    const totalExpenses = EXPENSES.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
    const totalIncome = EXPENSES.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0)
    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0

    // Breakdown by category
    const categoryBreakdown = EXPENSES.filter(e => e.type === 'expense').reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})

    res.json({
      success: true,
      summary: {
        totalExpenses,
        totalIncome,
        netProfit,
        profitMargin: parseFloat(profitMargin),
      },
      categoryBreakdown,
      transactions: EXPENSES
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expense records' })
  }
})

router.post('/add', (req, res) => {
  try {
    const { type, category, amount, crop, date, notes } = req.body
    if (!amount || !category) {
      return res.status(400).json({ success: false, message: 'Amount and category are required' })
    }

    const newRecord = {
      id: Date.now().toString(),
      type: type || 'expense',
      category,
      amount: parseFloat(amount),
      crop: crop || 'General Farm',
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || ''
    }

    EXPENSES.unshift(newRecord)

    res.json({ success: true, message: 'Transaction logged successfully', data: newRecord })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log transaction' })
  }
})

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    EXPENSES = EXPENSES.filter(e => e.id !== id)
    res.json({ success: true, message: 'Record deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete record' })
  }
})

export default router
