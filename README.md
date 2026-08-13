# 🌱 AgriVision AI — Precision Agriculture Platform

> **AgriVision AI** is an intelligent, full-stack precision agriculture web application designed to empower farmers, agronomists, and agricultural enterprises with AI-driven insights, crop disease diagnosis, real-time weather advisories, market prices, and voice-assisted decision support.

---

## ✨ Features

- 🌾 **Crop Recommendation Engine**: Predicts high-yielding crops based on soil nutrient levels (N, P, K, pH) and climate metrics (Temperature, Humidity, Rainfall).
- 🔬 **AI Disease Diagnosis & Health Scan**: Visual leaf image scanner that detects pathogens, provides severity ratings, and outputs organic & chemical treatment guides.
- 📈 **Yield & Revenue Forecasting**: Machine-learning driven yield potential calculator and revenue estimation tool.
- 🧪 **Fertilizer Dosage Advisory**: Precise N-P-K nutrient deficiency solver with application timelines.
- 🌤️ **Smart Agri-Weather Dashboard**: GPS-based real-time weather forecasts powered by OpenWeatherMap & Open-Meteo with automated farming advisories.
- 💰 **APMC Mandi Market Prices**: Real-time market rates for major Indian agricultural commodities.
- 🎙️ **Voice & Text AI Assistant**: Interactive voice search with speech recognition, text-to-speech output, and OpenAI GPT integration.
- 💧 **Smart Irrigation & Soil Health Score**: Soil quality index breakdown (0-100 pts) and water management guidance.
- 📜 **Government Schemes & Subsidies**: Direct access to agricultural credit, crop insurance, and subsidy schemes.
- 🌗 **Theme Support**: Dynamic Light & Dark Mode with rich CSS styling and accessible typography.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS Design System with custom tokens & glassmorphism
- **Icons & Charts**: React Icons (`react-icons/pi`), Chart.js (`react-chartjs-2`)
- **Speech API**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

### **Backend**
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **External APIs**: OpenWeatherMap API, Open-Meteo Geocoding, OpenAI GPT API

---

## 📁 Repository Structure

```
AgriVision-AI/
├── backend/
│   ├── models/           # Mongoose schemas (User, CropAnalysis)
│   ├── routes/           # API routes (weather, chat, crop, disease, fertilizer, yield, market, etc.)
│   ├── index.js          # Express server entry point
│   ├── package.json
│   └── .env              # Environment configuration
├── frontend/
│   ├── public/           # Static assets & PWA manifest
│   ├── src/
│   │   ├── components/   # Reusable UI components (SearchableSelect, Navbar, Modals)
│   │   ├── context/      # React contexts (AuthContext, ThemeContext, LanguageContext)
│   │   ├── pages/        # Dashboard, Crop Recommendation, Weather, Chat, etc.
│   │   ├── App.jsx       # Main App component & router
│   │   ├── index.css     # Design system & dark mode rules
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### 1. Environment Setup
Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 2. Install Dependencies & Run Backend

```bash
cd backend
npm install
npm run dev
```
*The backend server will start on `http://localhost:5000`.*

### 3. Install Dependencies & Run Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
*The frontend application will start on `http://localhost:5173`.*

---

## 🔒 Security Note
Never commit your `.env` file to version control. The repository includes `.gitignore` configurations to prevent API keys and database strings from being exposed.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
