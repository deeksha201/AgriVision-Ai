import express from 'express'

const router = express.Router()

router.post('/advisor', (req, res) => {
  try {
    const { crop, soilType, growthStage, recentRainfall } = req.body

    const cropName = crop || 'Tomato'
    const soil = soilType || 'Loamy Soil'
    const stage = growthStage || 'Vegetative'
    const rain = parseFloat(recentRainfall || 0)

    let recommendedLitersPerSqM = 4.5
    let frequency = 'Every 2 days'
    let status = 'Optimal'
    let delayRain = false
    let advice = []

    if (rain > 15) {
      delayRain = true
      status = 'Rain Delay Active'
      advice.push(`Heavy recent rainfall recorded (${rain} mm). Pause irrigation for the next 48 hours to prevent root rot.`)
    } else if (rain > 5) {
      recommendedLitersPerSqM = 2.0
      advice.push(`Light rain (${rain} mm) detected. Reduce normal watering volume by 50%.`)
    }

    if (soil.toLowerCase().includes('sandy')) {
      frequency = 'Daily (Light waterings)'
      recommendedLitersPerSqM += 1.0
      advice.push('Sandy soil drains quickly. Water frequently in smaller quantities.')
    } else if (soil.toLowerCase().includes('clay')) {
      frequency = 'Every 3 to 4 days'
      recommendedLitersPerSqM -= 0.5
      advice.push('Clay soil holds moisture longer. Ensure adequate field drainage to prevent waterlogging.')
    }

    if (stage.toLowerCase().includes('flowering') || stage.toLowerCase().includes('fruiting')) {
      recommendedLitersPerSqM += 1.5
      advice.push(`Critical ${stage} stage! Consistent moisture is crucial to prevent blossom end drop.`)
    }

    res.json({
      success: true,
      data: {
        crop: cropName,
        soilType: soil,
        growthStage: stage,
        status,
        delayRain,
        recommendedVolume: `${recommendedLitersPerSqM.toFixed(1)} Liters / m²`,
        recommendedFrequency: frequency,
        nextWateringTime: delayRain ? 'In 48 Hours' : 'Tomorrow Morning (6:00 AM)',
        advisories: advice,
        soilMoistureTarget: '60% - 75% Field Capacity'
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate irrigation schedule' })
  }
})

export default router
