import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const TRANSLATIONS = {
  en: {
    welcome: 'Welcome back',
    dashboard: 'Dashboard',
    marketPrices: 'Market Prices',
    cropRecommendation: 'Crop Recommendation',
    diseaseDetection: 'Disease Diagnosis',
    fertilizerRecommendation: 'Fertilizer Recommendation',
    yieldPrediction: 'Yield Prediction',
    weatherForecast: 'Weather Forecast',
    govSchemes: 'Government Schemes',
    expenseTracker: 'Expense Tracker',
    smartIrrigation: 'Smart Irrigation',
    soilHealth: 'Soil Health Score',
    farmCalendar: 'Farm Calendar',
    cropSoilChat: 'Crop & Soil Chat',
  },
  kn: {
    welcome: 'ಪುನಃ ಸುಸ್ವಾಗತ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    marketPrices: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
    cropRecommendation: 'ಬೆಳೆ ಶಿಫಾರಸು',
    diseaseDetection: 'ರೋಗ ನಿರ್ಣಯ',
    fertilizerRecommendation: 'ಗೊಬ್ಬರ ಶಿಫಾರಸು',
    yieldPrediction: 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ',
    weatherForecast: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    govSchemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    expenseTracker: 'ಖರ್ಚುಗಳ ಟ್ರ್ಯಾಕರ್',
    smartIrrigation: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ',
    soilHealth: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್',
    farmCalendar: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್',
    cropSoilChat: 'ಬೆಳೆ ಮತ್ತು ಮಣ್ಣಿನ ಚಾಟ್',
  },
  hi: {
    welcome: 'वापसी पर स्वागत है',
    dashboard: 'डैशबोर्ड',
    marketPrices: 'मंडी भाव',
    cropRecommendation: 'फसल सिफारिश',
    diseaseDetection: 'रोग पहचान',
    fertilizerRecommendation: 'उर्वरक सुझाव',
    yieldPrediction: 'उपज का अनुमान',
    weatherForecast: 'मौसम का पूर्वानुमान',
    govSchemes: 'सरकारी योजनाएं',
    expenseTracker: 'फार्म खर्च ट्रैकर',
    smartIrrigation: 'स्मार्ट सिंचाई',
    soilHealth: 'मृदा स्वास्थ्य स्कोर',
    farmCalendar: 'फार्म कैलेंडर',
    cropSoilChat: 'फसल और मिट्टी चैट',
  },
  te: {
    welcome: 'తిరిగి స్వాగతం',
    dashboard: 'డాష్‌బోర్డ్',
    marketPrices: 'మార్కెట్ ధరలు',
    cropRecommendation: 'పంట సిఫార్సు',
    diseaseDetection: 'వ్యాధి నిర్ధారణ',
    fertilizerRecommendation: 'ఎరువుల సిఫార్సు',
    yieldPrediction: 'దిగుబడి అంచనా',
    weatherForecast: 'వాతావరణ ముందస్తు అంచనా',
    govSchemes: 'ప్రభుత్వ పథకాలు',
    expenseTracker: 'వ్యవసాయ ఖర్చుల ట్రాకర్',
    smartIrrigation: 'స్మార్ట్ సాగునీరు',
    soilHealth: 'నేల ఆరోగ్య స్కోరు',
    farmCalendar: 'వ్యవసాయ క్యాలెండర్',
    cropSoilChat: 'పంట మరియు నేల చాట్',
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
