import express from 'express'

const router = express.Router()

const SCHEMES_DATABASE = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Financial Support',
    benefit: '₹6,000 / year in 3 equal installments',
    eligibility: 'All landholding farmer families across India',
    targetCrops: 'All Crops',
    state: 'All India',
    description: 'Direct income support scheme providing financial assistance to small and marginal farmers to meet agricultural input costs.',
    applyUrl: 'https://pmkisan.gov.in',
    badge: 'Popular'
  },
  {
    id: 'pmfby',
    title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    category: 'Crop Insurance',
    benefit: 'Comprehensive risk coverage against crop loss due to natural calamities',
    eligibility: 'Farmers growing notified crops in notified areas',
    targetCrops: 'Kharif, Rabi, & Commercial Crops',
    state: 'All India',
    description: 'Provides financial support to farmers suffering crop loss/damage arising out of unforeseen events.',
    applyUrl: 'https://pmfby.gov.in',
    badge: 'Essential'
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC) Scheme',
    category: 'Credit & Loans',
    benefit: 'Low-interest short-term credit up to ₹3 Lakhs at 4% effective interest rate',
    eligibility: 'Individual/Joint borrowers, Tenant farmers, Sharecroppers',
    targetCrops: 'All Crops',
    state: 'All India',
    description: 'Ensures farmers receive timely credit for cultivation, post-harvest expenses, and farm maintenance.',
    applyUrl: 'https://myscheme.gov.in',
    badge: 'Financial'
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    category: 'Soil Testing',
    benefit: 'Free soil testing & customized nutrient advice every 2 years',
    eligibility: 'All landowning farmers',
    targetCrops: 'All Crops',
    state: 'All India',
    description: 'Assists farmers in improving productivity through judicious use of fertilizers based on scientific soil reports.',
    applyUrl: 'https://soilhealth.dac.gov.in',
    badge: 'Free Test'
  },
  {
    id: 'pmksy',
    title: 'PMKSY - Micro Irrigation Subsidy (Per Drop More Crop)',
    category: 'Irrigation & Subsidy',
    benefit: 'Up to 55% subsidy for Small/Marginal farmers on Drip & Sprinklers',
    eligibility: 'Farmers having cultivable land with guaranteed water source',
    targetCrops: 'Horticulture, Sugarcane, Cotton',
    state: 'All India',
    description: 'Promotes micro-irrigation technologies to increase water use efficiency in agriculture.',
    applyUrl: 'https://pmksy.gov.in',
    badge: '55% Subsidy'
  },
  {
    id: 'raky',
    title: 'Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)',
    category: 'Infrastructure & AgTech',
    benefit: 'Funding up to ₹25 Lakhs for AgTech Startups & Farm Innovation',
    eligibility: 'Agri-entrepreneurs, Farmers, Cooperatives',
    targetCrops: 'All Crops',
    state: 'All India',
    description: 'Fosters agribusiness entrepreneurship by providing financial support and nurturing incubation ecosystems.',
    applyUrl: 'https://rkvy.nic.in',
    badge: 'Agri-Tech'
  },
  {
    id: 'karnataka-krishi-yantra',
    title: 'Krishi Yanthradhare Scheme (Karnataka)',
    category: 'Machinery Subsidy',
    benefit: 'Up to 50% - 75% subsidy on custom hiring center farm machinery rental',
    eligibility: 'Karnataka Domicile Farmers',
    targetCrops: 'Paddy, Ragi, Maize, Sugarcane',
    state: 'Karnataka',
    description: 'Provides farm machinery to small farmers at affordable hire charges.',
    applyUrl: 'https://raitamitra.karnataka.gov.in',
    badge: 'Karnataka State'
  }
]

router.get('/', (req, res) => {
  try {
    const { category, state, search } = req.query
    let filtered = SCHEMES_DATABASE

    if (category && category !== 'All') {
      filtered = filtered.filter(s => s.category.toLowerCase().includes(category.toLowerCase()))
    }

    if (state && state !== 'All') {
      filtered = filtered.filter(s => s.state === 'All India' || s.state.toLowerCase() === state.toLowerCase())
    }

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q)
      )
    }

    res.json({ success: true, count: filtered.length, data: filtered })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch government schemes' })
  }
})

export default router
