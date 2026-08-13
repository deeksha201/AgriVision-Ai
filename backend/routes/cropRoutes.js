import express from 'express'

const router = express.Router()

// Agricultural reference database for top Indian & Global crops
const CROP_DATABASE = [
  { name: 'Rice', n: [60, 120], p: [35, 60], k: [35, 50], temp: [20, 35], humidity: [70, 90], ph: [5.5, 7.2], rainfall: [150, 300], seasons: ['Kharif'], tips: 'Requires submerged water during early growth. High nitrogen demand.' },
  { name: 'Wheat', n: [80, 140], p: [40, 70], k: [40, 60], temp: [12, 25], humidity: [50, 70], ph: [6.0, 7.5], rainfall: [50, 100], seasons: ['Rabi'], tips: 'Cool season crop. Requires well-drained loamy soil and 3-4 irrigations.' },
  { name: 'Maize (Corn)', n: [60, 100], p: [35, 60], k: [20, 45], temp: [18, 32], humidity: [55, 75], ph: [5.8, 7.3], rainfall: [60, 120], seasons: ['Kharif', 'Rabi'], tips: 'Versatile crop. Sensitive to waterlogging; maintain proper drainage.' },
  { name: 'Cotton', n: [75, 120], p: [40, 65], k: [35, 60], temp: [21, 35], humidity: [45, 70], ph: [6.0, 8.0], rainfall: [50, 110], seasons: ['Kharif'], tips: 'Deep black cotton soil preferred. Requires clear bright sunshine during boll maturation.' },
  { name: 'Sugarcane', n: [100, 180], p: [50, 90], k: [50, 110], temp: [24, 38], humidity: [60, 85], ph: [6.0, 7.8], rainfall: [120, 250], seasons: ['Annual'], tips: 'Long duration crop. High fertilizer and moisture requirement.' },
  { name: 'Chickpea (Gram)', n: [15, 35], p: [40, 70], k: [20, 45], temp: [15, 28], humidity: [40, 65], ph: [6.0, 7.8], rainfall: [40, 80], seasons: ['Rabi'], tips: 'Legume crop fixes atmospheric nitrogen. Avoid excess water and nitrogen fertilization.' },
  { name: 'Groundnut (Peanut)', n: [15, 30], p: [35, 60], k: [35, 55], temp: [22, 33], humidity: [50, 75], ph: [6.0, 7.5], rainfall: [50, 100], seasons: ['Kharif'], tips: 'Requires light sandy loam soil for easy peg penetration.' },
  { name: 'Tomato', n: [70, 110], p: [45, 80], k: [50, 90], temp: [18, 30], humidity: [50, 70], ph: [6.0, 7.0], rainfall: [40, 90], seasons: ['All Seasons'], tips: 'High potassium requirement for fruit quality. Prone to late blight under high humidity.' },
  { name: 'Potato', n: [80, 130], p: [50, 85], k: [80, 140], temp: [15, 24], humidity: [60, 80], ph: [5.2, 6.5], rainfall: [40, 80], seasons: ['Rabi'], tips: 'Requires cool weather for tuberization. Slightly acidic soil prevents scab disease.' },
  { name: 'Soybean', n: [20, 40], p: [45, 75], k: [25, 50], temp: [20, 32], humidity: [60, 80], ph: [6.0, 7.2], rainfall: [65, 110], seasons: ['Kharif'], tips: 'Rich in protein & oil. Benefits from Rhizobium biofertilizer inoculation.' },
]

router.post('/recommend', async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body

    const N = Number(nitrogen) || 0
    const P = Number(phosphorus) || 0
    const K = Number(potassium) || 0
    const Temp = Number(temperature) || 25
    const Hum = Number(humidity) || 60
    const PH = Number(ph) || 6.5
    const Rain = Number(rainfall) || 100

    // Score crops based on parameter range matching
    const scoredCrops = CROP_DATABASE.map(crop => {
      let score = 0
      let totalParams = 7

      const checkRange = (val, range) => {
        if (val >= range[0] && val <= range[1]) return 1
        const dist = Math.min(Math.abs(val - range[0]), Math.abs(val - range[1]))
        const span = range[1] - range[0]
        return Math.max(0, 1 - dist / (span * 1.5))
      }

      score += checkRange(N, crop.n) * 1.5 // High weight for N-P-K
      score += checkRange(P, crop.p) * 1.5
      score += checkRange(K, crop.k) * 1.5
      score += checkRange(Temp, crop.temp) * 1.2
      score += checkRange(Hum, crop.humidity) * 1.0
      score += checkRange(PH, crop.ph) * 1.0
      score += checkRange(Rain, crop.rainfall) * 1.3

      const maxPossibleScore = 1.5 + 1.5 + 1.5 + 1.2 + 1.0 + 1.0 + 1.3
      const confidence = Math.min(99, Math.round((score / maxPossibleScore) * 100))

      return {
        crop: crop.name,
        confidence,
        seasons: crop.seasons,
        tips: crop.tips,
        idealRanges: {
          nitrogen: `${crop.n[0]} - ${crop.n[1]} kg/ha`,
          phosphorus: `${crop.p[0]} - ${crop.p[1]} kg/ha`,
          potassium: `${crop.k[0]} - ${crop.k[1]} kg/ha`,
          temperature: `${crop.temp[0]} - ${crop.temp[1]} °C`,
          ph: `${crop.ph[0]} - ${crop.ph[1]}`,
          rainfall: `${crop.rainfall[0]} - ${crop.rainfall[1]} mm`,
        }
      }
    })

    scoredCrops.sort((a, b) => b.confidence - a.confidence)

    res.json({
      success: true,
      topRecommendation: scoredCrops[0],
      alternativeCrops: scoredCrops.slice(1, 4),
      inputSummary: { N, P, K, Temp, Hum, PH, Rain }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Crop recommendation failed', error: error.message })
  }
})

export default router
