import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CropRecommendation from './pages/CropRecommendation'
import DiseaseDetection from './pages/DiseaseDetection'
import YieldPrediction from './pages/YieldPrediction'
import FertilizerRecommendation from './pages/FertilizerRecommendation'
import WeatherDashboard from './pages/WeatherDashboard'
import MarketPrices from './pages/MarketPrices'
import CropSoilChat from './pages/CropSoilChat'
import GovernmentSchemes from './pages/GovernmentSchemes'
import ExpenseTracker from './pages/ExpenseTracker'
import SmartIrrigation from './pages/SmartIrrigation'
import SoilHealth from './pages/SoilHealth'
import FarmCalendar from './pages/FarmCalendar'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/crop-recommendation" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
              <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
              <Route path="/yield-prediction" element={<ProtectedRoute><YieldPrediction /></ProtectedRoute>} />
              <Route path="/fertilizer-recommendation" element={<ProtectedRoute><FertilizerRecommendation /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><WeatherDashboard /></ProtectedRoute>} />
              <Route path="/market-prices" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
              <Route path="/crop-soil-chat" element={<ProtectedRoute><CropSoilChat /></ProtectedRoute>} />
              <Route path="/schemes" element={<ProtectedRoute><GovernmentSchemes /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
              <Route path="/irrigation" element={<ProtectedRoute><SmartIrrigation /></ProtectedRoute>} />
              <Route path="/soil-health" element={<ProtectedRoute><SoilHealth /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><FarmCalendar /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App