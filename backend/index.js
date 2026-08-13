import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import cropRoutes from './routes/cropRoutes.js'
import diseaseRoutes from './routes/diseaseRoutes.js'
import fertilizerRoutes from './routes/fertilizerRoutes.js'
import yieldRoutes from './routes/yieldRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'
import marketRoutes from './routes/marketRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import schemeRoutes from './routes/schemeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import irrigationRoutes from './routes/irrigationRoutes.js'
import soilHealthRoutes from './routes/soilHealthRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(express.json())

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'AgriVision AI backend is running', status: 'ok' })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/crops', cropRoutes)
app.use('/api/disease', diseaseRoutes)
app.use('/api/fertilizer', fertilizerRoutes)
app.use('/api/yield', yieldRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/schemes', schemeRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/irrigation', irrigationRoutes)
app.use('/api/soil-health', soilHealthRoutes)
app.use('/api/admin', adminRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

const PORT = process.env.PORT || 5000

// Non-blocking MongoDB connection attempt with 3s timeout
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 3000,
  })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.warn('⚠️ MongoDB connection warning (Using local session fallback):', err.message))
}

// Start Express server immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
})
