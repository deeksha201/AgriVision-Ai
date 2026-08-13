import express from 'express'

const router = express.Router()

// ── Region → Soil Database ──────────────────────────────────────────
const REGION_SOIL_MAP = {
  'Karnataka': {
    soils: ['Red Soil', 'Laterite Soil', 'Black Cotton Soil'],
    state: 'Karnataka',
    climate: 'Tropical Monsoon',
  },
  'Punjab': {
    soils: ['Alluvial Soil'],
    state: 'Punjab',
    climate: 'Semi-Arid Continental',
  },
  'Haryana': {
    soils: ['Alluvial Soil', 'Sandy Soil'],
    state: 'Haryana',
    climate: 'Semi-Arid Continental',
  },
  'Maharashtra': {
    soils: ['Black Cotton Soil', 'Laterite Soil', 'Red Soil'],
    state: 'Maharashtra',
    climate: 'Tropical Monsoon',
  },
  'Rajasthan': {
    soils: ['Arid/Desert Soil', 'Sandy Soil', 'Alluvial Soil'],
    state: 'Rajasthan',
    climate: 'Hot Desert & Semi-Arid',
  },
  'Kerala': {
    soils: ['Laterite Soil', 'Alluvial Soil', 'Forest Soil'],
    state: 'Kerala',
    climate: 'Tropical Maritime',
  },
  'West Bengal': {
    soils: ['Alluvial Soil', 'Deltaic Soil', 'Laterite Soil'],
    state: 'West Bengal',
    climate: 'Tropical Humid',
  },
  'Tamil Nadu': {
    soils: ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil'],
    state: 'Tamil Nadu',
    climate: 'Tropical',
  },
  'Uttar Pradesh': {
    soils: ['Alluvial Soil', 'Sandy Loam'],
    state: 'Uttar Pradesh',
    climate: 'Subtropical',
  },
  'Madhya Pradesh': {
    soils: ['Black Cotton Soil', 'Red Soil', 'Alluvial Soil'],
    state: 'Madhya Pradesh',
    climate: 'Subtropical',
  },
  'Andhra Pradesh': {
    soils: ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Laterite Soil'],
    state: 'Andhra Pradesh',
    climate: 'Tropical',
  },
  'Gujarat': {
    soils: ['Black Cotton Soil', 'Alluvial Soil', 'Sandy Soil'],
    state: 'Gujarat',
    climate: 'Semi-Arid to Arid',
  },
  'Telangana': {
    soils: ['Red Soil', 'Black Cotton Soil', 'Laterite Soil'],
    state: 'Telangana',
    climate: 'Tropical Semi-Arid',
  },
}

// ── Soil Properties Database ────────────────────────────────────────
const SOIL_PROPERTIES = {
  'Red Soil': { waterRetention: 'Medium', fertility: 'Medium', ph: [6.0, 7.5], organic: 'Low-Medium', texture: 'Sandy Loam', color: '#c0392b' },
  'Laterite Soil': { waterRetention: 'Low', fertility: 'Low', ph: [5.0, 6.5], organic: 'Low', texture: 'Gravelly', color: '#e67e22' },
  'Black Cotton Soil': { waterRetention: 'High', fertility: 'High', ph: [7.0, 8.5], organic: 'Medium-High', texture: 'Clay', color: '#2c3e50' },
  'Alluvial Soil': { waterRetention: 'High', fertility: 'Very High', ph: [6.5, 8.0], organic: 'High', texture: 'Loam-Silt', color: '#27ae60' },
  'Arid/Desert Soil': { waterRetention: 'Very Low', fertility: 'Low', ph: [7.5, 9.0], organic: 'Very Low', texture: 'Sandy', color: '#f39c12' },
  'Sandy Soil': { waterRetention: 'Very Low', fertility: 'Low', ph: [6.0, 7.5], organic: 'Low', texture: 'Sandy', color: '#d4a96a' },
  'Forest Soil': { waterRetention: 'High', fertility: 'High', ph: [5.5, 7.0], organic: 'Very High', texture: 'Loam', color: '#1a5e20' },
  'Deltaic Soil': { waterRetention: 'Very High', fertility: 'Very High', ph: [6.0, 7.5], organic: 'High', texture: 'Clay-Silt', color: '#5d4037' },
  'Sandy Loam': { waterRetention: 'Medium', fertility: 'Medium-High', ph: [6.0, 7.8], organic: 'Medium', texture: 'Sandy Loam', color: '#8d6e63' },
  'Black Soil': { waterRetention: 'High', fertility: 'High', ph: [7.0, 8.5], organic: 'Medium-High', texture: 'Clay', color: '#37474f' },
}

// ── Crop-Soil Suitability Scores (0 to 1) ───────────────────────────
const CROP_SOIL_SCORES = {
  'Rice': { 'Alluvial Soil': 0.95, 'Deltaic Soil': 0.92, 'Black Cotton Soil': 0.80, 'Laterite Soil': 0.60, 'Red Soil': 0.55, 'Sandy Loam': 0.50, 'Forest Soil': 0.45, 'Sandy Soil': 0.25, 'Arid/Desert Soil': 0.15, 'Black Soil': 0.78 },
  'Wheat': { 'Alluvial Soil': 0.95, 'Sandy Loam': 0.88, 'Black Cotton Soil': 0.82, 'Deltaic Soil': 0.75, 'Red Soil': 0.60, 'Laterite Soil': 0.40, 'Forest Soil': 0.35, 'Sandy Soil': 0.30, 'Arid/Desert Soil': 0.20, 'Black Soil': 0.80 },
  'Maize': { 'Alluvial Soil': 0.90, 'Sandy Loam': 0.88, 'Red Soil': 0.78, 'Black Cotton Soil': 0.75, 'Laterite Soil': 0.55, 'Forest Soil': 0.50, 'Deltaic Soil': 0.60, 'Sandy Soil': 0.40, 'Arid/Desert Soil': 0.25, 'Black Soil': 0.73 },
  'Cotton': { 'Black Cotton Soil': 0.98, 'Black Soil': 0.95, 'Alluvial Soil': 0.75, 'Red Soil': 0.60, 'Sandy Loam': 0.50, 'Laterite Soil': 0.35, 'Sandy Soil': 0.30, 'Forest Soil': 0.25, 'Deltaic Soil': 0.40, 'Arid/Desert Soil': 0.20 },
  'Sugarcane': { 'Alluvial Soil': 0.92, 'Black Cotton Soil': 0.88, 'Deltaic Soil': 0.85, 'Sandy Loam': 0.78, 'Red Soil': 0.60, 'Laterite Soil': 0.45, 'Forest Soil': 0.40, 'Sandy Soil': 0.30, 'Arid/Desert Soil': 0.15, 'Black Soil': 0.85 },
  'Tomato': { 'Red Soil': 0.90, 'Sandy Loam': 0.88, 'Alluvial Soil': 0.85, 'Black Cotton Soil': 0.70, 'Laterite Soil': 0.55, 'Forest Soil': 0.50, 'Deltaic Soil': 0.60, 'Sandy Soil': 0.40, 'Arid/Desert Soil': 0.20, 'Black Soil': 0.68 },
  'Potato': { 'Sandy Loam': 0.95, 'Alluvial Soil': 0.90, 'Red Soil': 0.75, 'Forest Soil': 0.65, 'Laterite Soil': 0.50, 'Black Cotton Soil': 0.45, 'Deltaic Soil': 0.55, 'Sandy Soil': 0.40, 'Arid/Desert Soil': 0.20, 'Black Soil': 0.43 },
  'Soybean': { 'Black Cotton Soil': 0.92, 'Black Soil': 0.90, 'Alluvial Soil': 0.82, 'Sandy Loam': 0.75, 'Red Soil': 0.65, 'Laterite Soil': 0.45, 'Forest Soil': 0.40, 'Deltaic Soil': 0.50, 'Sandy Soil': 0.30, 'Arid/Desert Soil': 0.15 },
  'Groundnut': { 'Sandy Loam': 0.95, 'Red Soil': 0.90, 'Alluvial Soil': 0.78, 'Sandy Soil': 0.70, 'Laterite Soil': 0.55, 'Black Cotton Soil': 0.40, 'Forest Soil': 0.35, 'Deltaic Soil': 0.45, 'Arid/Desert Soil': 0.30, 'Black Soil': 0.38 },
  'Chickpea': { 'Black Cotton Soil': 0.90, 'Black Soil': 0.88, 'Alluvial Soil': 0.80, 'Sandy Loam': 0.75, 'Red Soil': 0.65, 'Laterite Soil': 0.40, 'Forest Soil': 0.35, 'Deltaic Soil': 0.45, 'Sandy Soil': 0.30, 'Arid/Desert Soil': 0.25 },
}

// ── Base yields per acre (in metric tons) ───────────────────────────
const YIELD_RATES = {
  'Rice': 1.8, 'Wheat': 1.6, 'Maize': 2.2, 'Cotton': 0.8,
  'Sugarcane': 35.0, 'Tomato': 12.0, 'Potato': 10.0, 'Soybean': 1.1,
  'Groundnut': 0.9, 'Chickpea': 0.85, 'Default': 1.5,
}

// ── Mandi prices per quintal ────────────────────────────────────────
const MANDI_PRICES = {
  'Rice': 2350, 'Wheat': 2275, 'Maize': 2120, 'Cotton': 7150,
  'Sugarcane': 340, 'Tomato': 1950, 'Potato': 1420, 'Soybean': 4680,
  'Groundnut': 5850, 'Chickpea': 5440, 'Default': 2000,
}

// ── National average yield per acre (tons) for comparison ───────────
const NATIONAL_AVG_YIELD = {
  'Rice': 1.5, 'Wheat': 1.4, 'Maize': 1.8, 'Cotton': 0.6,
  'Sugarcane': 30.0, 'Tomato': 10.0, 'Potato': 8.5, 'Soybean': 0.9,
  'Groundnut': 0.7, 'Chickpea': 0.7, 'Default': 1.2,
}

// ── Production cost per acre (₹) ────────────────────────────────────
const PRODUCTION_COST = {
  'Rice': 18000, 'Wheat': 14000, 'Maize': 12000, 'Cotton': 22000,
  'Sugarcane': 45000, 'Tomato': 35000, 'Potato': 30000, 'Soybean': 16000,
  'Groundnut': 20000, 'Chickpea': 15000, 'Default': 15000,
}


// ── GET /regions — Return all regions and their soils ───────────────
router.get('/regions', (req, res) => {
  const regions = Object.entries(REGION_SOIL_MAP).map(([name, data]) => ({
    name,
    soils: data.soils,
    climate: data.climate,
  }))
  res.json({ success: true, regions })
})


// ── POST /predict — Yield & Revenue Prediction ─────────────────────
router.post('/predict', async (req, res) => {
  try {
    const { crop, area, season, region, soilType } = req.body

    const acres = Number(area) || 1
    const selectedCrop = crop || 'Rice'
    const selectedRegion = region || 'Karnataka'
    const selectedSoil = soilType || 'Red Soil'

    // Get soil suitability score
    const cropScores = CROP_SOIL_SCORES[selectedCrop] || {}
    const soilScore = cropScores[selectedSoil] || 0.5

    // Get soil properties
    const soilProps = SOIL_PROPERTIES[selectedSoil] || SOIL_PROPERTIES['Red Soil']

    // Calculate yield with soil factor
    const baseYieldPerAcre = YIELD_RATES[selectedCrop] || YIELD_RATES['Default']
    const soilFactor = 0.5 + (soilScore * 0.6) // Range: 0.5 to 1.1
    const estimatedYieldTons = Number((baseYieldPerAcre * acres * soilFactor).toFixed(2))
    const estimatedYieldQuintals = Number((estimatedYieldTons * 10).toFixed(1))

    // Revenue calculation
    const pricePerQuintal = MANDI_PRICES[selectedCrop] || MANDI_PRICES['Default']
    const grossRevenue = Math.round(estimatedYieldQuintals * pricePerQuintal)
    const productionCost = Math.round((PRODUCTION_COST[selectedCrop] || PRODUCTION_COST['Default']) * acres)
    const netProfit = grossRevenue - productionCost

    // Regional average yield
    const regionalAvgTotal = Number(((NATIONAL_AVG_YIELD[selectedCrop] || NATIONAL_AVG_YIELD['Default']) * acres * 1.05).toFixed(2))
    const nationalAvgTotal = Number(((NATIONAL_AVG_YIELD[selectedCrop] || NATIONAL_AVG_YIELD['Default']) * acres).toFixed(2))

    // Soil suitability breakdown for all soil types in the region
    const regionData = REGION_SOIL_MAP[selectedRegion] || { soils: [selectedSoil] }
    const soilComparison = regionData.soils.map(soil => ({
      soil,
      score: Math.round((cropScores[soil] || 0.5) * 100),
      selected: soil === selectedSoil,
    }))

    // Graph data: yield comparison bar chart
    const yieldComparisonData = {
      labels: ['Your Predicted Yield', 'Regional Average', 'National Average'],
      datasets: [{
        data: [estimatedYieldTons, regionalAvgTotal, nationalAvgTotal],
        colors: ['#10b981', '#6366f1', '#94a3b8'],
      }],
    }

    // Graph data: revenue doughnut chart
    const revenueBreakdownData = {
      labels: ['Net Profit', 'Production Cost'],
      datasets: [{
        data: [Math.max(0, netProfit), productionCost],
        colors: ['#10b981', '#ef4444'],
      }],
    }

    res.json({
      success: true,
      crop: selectedCrop,
      areaAcres: acres,
      season: season || 'Kharif',
      region: selectedRegion,
      soilType: selectedSoil,
      predictions: {
        totalYieldTons: estimatedYieldTons,
        totalYieldQuintals: estimatedYieldQuintals,
        yieldPerAcre: Number((estimatedYieldTons / acres).toFixed(2)),
        grossRevenueINR: grossRevenue,
        grossRevenueFormatted: `₹${grossRevenue.toLocaleString('en-IN')}`,
        productionCostINR: productionCost,
        productionCostFormatted: `₹${productionCost.toLocaleString('en-IN')}`,
        netProfitINR: netProfit,
        netProfitFormatted: `₹${netProfit.toLocaleString('en-IN')}`,
        confidenceScore: `${Math.round(soilScore * 100)}%`,
      },
      soilAnalysis: {
        suitabilityScore: Math.round(soilScore * 100),
        soilProperties: soilProps,
        waterRetention: soilProps.waterRetention,
        fertility: soilProps.fertility,
        phRange: `${soilProps.ph[0]} – ${soilProps.ph[1]}`,
        organicContent: soilProps.organic,
        texture: soilProps.texture,
        soilComparison,
      },
      charts: {
        yieldComparison: yieldComparisonData,
        revenueBreakdown: revenueBreakdownData,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Yield prediction failed', error: error.message })
  }
})

export default router
