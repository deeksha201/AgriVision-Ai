import express from 'express'

const router = express.Router()

router.post('/analyze', (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, organicCarbon } = req.body

    const n = parseFloat(nitrogen || 90)
    const p = parseFloat(phosphorus || 42)
    const k = parseFloat(potassium || 43)
    const soilPh = parseFloat(ph || 6.5)
    const oc = parseFloat(organicCarbon || 0.65)

    let score = 100
    const issues = []
    const recommendations = []
    const scoreBreakdown = []

    // Nitrogen check
    if (n < 50) {
      score -= 15
      scoreBreakdown.push({ label: 'Low Nitrogen (<50 kg/ha)', deduction: 15 })
      issues.push('Low Nitrogen (Deficient)')
      recommendations.push('Apply Neem-coated Urea or Farm Yard Manure (FYM) @ 10 tons/ha.')
    } else if (n > 140) {
      score -= 10
      scoreBreakdown.push({ label: 'Excess Nitrogen (>140 kg/ha)', deduction: 10 })
      issues.push('Excess Nitrogen')
      recommendations.push('Reduce nitrogenous fertilizer application to prevent vegetative overgrowth.')
    } else {
      scoreBreakdown.push({ label: 'Nitrogen Level (Optimal)', deduction: 0 })
    }

    // Phosphorus check
    if (p < 25) {
      score -= 15
      scoreBreakdown.push({ label: 'Low Phosphorus (<25 kg/ha)', deduction: 15 })
      issues.push('Low Phosphorus')
      recommendations.push('Incorporate Single Super Phosphate (SSP) or Rock Phosphate.')
    } else {
      scoreBreakdown.push({ label: 'Phosphorus Level (Optimal)', deduction: 0 })
    }

    // Potassium check
    if (k < 30) {
      score -= 15
      scoreBreakdown.push({ label: 'Low Potassium (<30 kg/ha)', deduction: 15 })
      issues.push('Low Potassium')
      recommendations.push('Apply Muriate of Potash (MOP) @ 50 kg/ha.')
    } else {
      scoreBreakdown.push({ label: 'Potassium Level (Optimal)', deduction: 0 })
    }

    // pH check
    if (soilPh < 5.5) {
      score -= 20
      scoreBreakdown.push({ label: 'Strongly Acidic Soil (pH <5.5)', deduction: 20 })
      issues.push('Strongly Acidic Soil')
      recommendations.push('Apply Agricultural Lime (Calcite/Dolomite) @ 2 tons/ha to neutralize soil acidity.')
    } else if (soilPh > 8.2) {
      score -= 20
      scoreBreakdown.push({ label: 'Alkaline Soil (pH >8.2)', deduction: 20 })
      issues.push('Alkaline Soil')
      recommendations.push('Apply Gypsum @ 500 kg/ha and increase organic compost application.')
    } else {
      scoreBreakdown.push({ label: 'Soil pH (Optimal Range)', deduction: 0 })
    }

    // Organic Carbon check
    if (oc < 0.5) {
      score -= 15
      scoreBreakdown.push({ label: 'Low Organic Carbon (<0.5%)', deduction: 15 })
      issues.push('Low Organic Matter (<0.5%)')
      recommendations.push('Grow green manure crops (Dhaincha/Sunn hemp) and incorporate crop residues.')
    } else {
      scoreBreakdown.push({ label: 'Organic Carbon (Good)', deduction: 0 })
    }

    score = Math.max(20, Math.min(100, score))
    let rating = 'Excellent Soil Quality'
    if (score < 50) rating = 'Poor / High Deficiency'
    else if (score < 75) rating = 'Moderate / Needs Attention'

    if (recommendations.length === 0) {
      recommendations.push('Maintain existing organic farming practices, crop rotation, and balanced compost application.')
    }

    res.json({
      success: true,
      data: {
        score,
        rating,
        scoreBreakdown,
        metrics: {
          nitrogen: { value: n, status: n < 50 ? 'Low' : n > 140 ? 'High' : 'Optimal' },
          phosphorus: { value: p, status: p < 25 ? 'Low' : 'Optimal' },
          potassium: { value: k, status: k < 30 ? 'Low' : 'Optimal' },
          ph: { value: soilPh, status: soilPh < 5.5 ? 'Acidic' : soilPh > 8.2 ? 'Alkaline' : 'Optimal' },
          organicCarbon: { value: `${oc}%`, status: oc < 0.5 ? 'Low' : 'Good' }
        },
        issues,
        recommendations
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to analyze soil health', error: error.message })
  }
})

export default router
