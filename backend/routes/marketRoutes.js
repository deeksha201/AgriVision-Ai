import express from 'express'

const router = express.Router()

// Base market data
const COMMODITIES = [
  // ── Cereals ──
  { id: 'rice', name: 'Rice', category: 'Cereals', basePrice: 2450, unit: 'Quintal', icon: '🌾' },
  { id: 'wheat', name: 'Wheat', category: 'Cereals', basePrice: 2275, unit: 'Quintal', icon: '🌾' },
  { id: 'maize', name: 'Maize', category: 'Cereals', basePrice: 2090, unit: 'Quintal', icon: '🌽' },
  { id: 'bajra', name: 'Bajra (Pearl Millet)', category: 'Cereals', basePrice: 2500, unit: 'Quintal', icon: '🌾' },
  { id: 'jowar', name: 'Jowar (Sorghum)', category: 'Cereals', basePrice: 3180, unit: 'Quintal', icon: '🌾' },
  { id: 'ragi', name: 'Ragi (Finger Millet)', category: 'Cereals', basePrice: 3846, unit: 'Quintal', icon: '🌾' },

  // ── Pulses ──
  { id: 'moong', name: 'Moong (Green Gram)', category: 'Pulses', basePrice: 8558, unit: 'Quintal', icon: '🟢' },
  { id: 'urad', name: 'Urad (Black Gram)', category: 'Pulses', basePrice: 6950, unit: 'Quintal', icon: '⚫' },
  { id: 'toor', name: 'Toor (Pigeon Pea)', category: 'Pulses', basePrice: 7000, unit: 'Quintal', icon: '🟡' },
  { id: 'chickpea', name: 'Chickpea (Chana)', category: 'Pulses', basePrice: 5335, unit: 'Quintal', icon: '🧆' },

  // ── Cash Crops ──
  { id: 'cotton', name: 'Cotton (Long Staple)', category: 'Cash Crops', basePrice: 7020, unit: 'Quintal', icon: '☁️' },
  { id: 'sugarcane', name: 'Sugarcane', category: 'Cash Crops', basePrice: 315, unit: 'Quintal', icon: '🎋' },
  { id: 'jute', name: 'Jute', category: 'Cash Crops', basePrice: 5050, unit: 'Quintal', icon: '🧵' },
  { id: 'coffee', name: 'Coffee (Arabica)', category: 'Cash Crops', basePrice: 16500, unit: 'Quintal', icon: '☕' },

  // ── Oilseeds ──
  { id: 'soybean', name: 'Soybean', category: 'Oilseeds', basePrice: 4600, unit: 'Quintal', icon: '🌱' },
  { id: 'groundnut', name: 'Groundnut', category: 'Oilseeds', basePrice: 6377, unit: 'Quintal', icon: '🥜' },
  { id: 'mustard', name: 'Mustard Seed', category: 'Oilseeds', basePrice: 5450, unit: 'Quintal', icon: '🌼' },
  { id: 'sunflower', name: 'Sunflower Seed', category: 'Oilseeds', basePrice: 6760, unit: 'Quintal', icon: '🌻' },

  // ── Vegetables & Spices ──
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', basePrice: 2200, unit: 'Quintal', icon: '🍅' },
  { id: 'potato', name: 'Potato', category: 'Vegetables', basePrice: 1450, unit: 'Quintal', icon: '🥔' },
  { id: 'onion', name: 'Onion', category: 'Vegetables', basePrice: 1850, unit: 'Quintal', icon: '🧅' },
  { id: 'turmeric', name: 'Turmeric', category: 'Spices', basePrice: 13500, unit: 'Quintal', icon: '✨' },
]

// Pseudo-random number generator based on a seed
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Generate dynamic prices based on the current date
function generateRealtimeData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaySeed = today.getTime()

  return COMMODITIES.map(commodity => {
    // Generate trend for the last 7 days
    const trend = []
    let currentBase = commodity.basePrice

    for (let i = 6; i >= 0; i--) {
      const dateSeed = todaySeed - (i * 86400000)
      // Commodity specific volatility
      const volatility = 0.01 + (seededRandom(dateSeed + commodity.id.charCodeAt(0)) * 0.04) // 1% to 5% volatility
      const direction = seededRandom(dateSeed + commodity.id.charCodeAt(1)) > 0.5 ? 1 : -1
      
      const fluctuation = currentBase * volatility * direction
      const price = Math.round(currentBase + fluctuation)
      
      trend.push(price)
      currentBase = price // drift base price
    }

    const todayPrice = trend[trend.length - 1]
    const yesterdayPrice = trend[trend.length - 2]
    const percentChange = ((todayPrice - yesterdayPrice) / yesterdayPrice * 100).toFixed(1)
    
    // Generate some fake volume
    const volume = Math.floor(500 + seededRandom(todaySeed) * 2000)

    return {
      ...commodity,
      currentPrice: todayPrice,
      yesterdayPrice: yesterdayPrice,
      percentChange: parseFloat(percentChange),
      trend, // Array of 7 prices for charting
      volume,
      lastUpdated: new Date().toISOString()
    }
  })
}

router.get('/', (req, res) => {
  try {
    const liveData = generateRealtimeData()
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: liveData.length,
      data: liveData
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch market prices' })
  }
})

export default router
