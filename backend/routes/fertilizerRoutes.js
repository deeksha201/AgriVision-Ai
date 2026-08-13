import express from 'express'

const router = express.Router()

router.post('/recommend', async (req, res) => {
  try {
    const { soilType, cropType, nitrogen, phosphorus, potassium } = req.body

    const N = Number(nitrogen) || 0
    const P = Number(phosphorus) || 0
    const K = Number(potassium) || 0

    // Target ideal baseline N-P-K (kg/ha) per crop
    const targetMap = {
      'Rice': { n: 100, p: 50, k: 50 },
      'Wheat': { n: 120, p: 60, k: 40 },
      'Maize': { n: 90, p: 45, k: 40 },
      'Cotton': { n: 100, p: 50, k: 50 },
      'Sugarcane': { n: 150, p: 75, k: 75 },
      'Tomato': { n: 100, p: 60, k: 70 },
      'Default': { n: 90, p: 50, k: 50 }
    }

    const target = targetMap[cropType] || targetMap['Default']

    const diffN = target.n - N
    const diffP = target.p - P
    const diffK = target.k - K

    const recommendations = []

    if (diffN > 15) {
      recommendations.push({
        nutrient: 'Nitrogen (N)',
        deficit: `${diffN} kg/ha`,
        primaryFertilizer: 'Urea (46% N)',
        dosage: `${Math.round(diffN / 0.46)} kg/acre`,
        instruction: 'Apply in 2-3 split doses: 50% at sowing/basal, 25% at vegetative growth, 25% at flowering.'
      })
    }

    if (diffP > 10) {
      recommendations.push({
        nutrient: 'Phosphorus (P)',
        deficit: `${diffP} kg/ha`,
        primaryFertilizer: 'Single Super Phosphate (SSP - 16% P2O5) or DAP (18% N + 46% P)',
        dosage: `${Math.round(diffP / 0.16)} kg/acre of SSP`,
        instruction: 'Apply full dose at sowing as basal application placed 5cm below the seed.'
      })
    }

    if (diffK > 10) {
      recommendations.push({
        nutrient: 'Potassium (K)',
        deficit: `${diffK} kg/ha`,
        primaryFertilizer: 'Muriate of Potash (MOP - 60% K2O)',
        dosage: `${Math.round(diffK / 0.60)} kg/acre`,
        instruction: 'Apply 50% at sowing and remaining 50% at panicle initiation/flowering.'
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        nutrient: 'Balanced Soil',
        deficit: 'Optimal levels maintained',
        primaryFertilizer: 'Organic Compost / Vermicompost',
        dosage: '2-3 Tons/acre',
        instruction: 'Soil nutrient levels are healthy! Maintain organic matter content with biofertilizers.'
      })
    }

    res.json({
      success: true,
      soilType: soilType || 'Loamy Soil',
      cropType: cropType || 'General Crop',
      nutrientStatus: {
        nitrogen: N < target.n ? 'Deficient' : 'Adequate',
        phosphorus: P < target.p ? 'Deficient' : 'Adequate',
        potassium: K < target.k ? 'Deficient' : 'Adequate',
      },
      recommendations,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fertilizer recommendation failed', error: error.message })
  }
})

export default router
