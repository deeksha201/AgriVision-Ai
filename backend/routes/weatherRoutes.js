import express from 'express'

const router = express.Router()

router.get('/current', async (req, res) => {
  const city = req.query.city || 'Bangalore'
  const apiKey = (process.env.OPENWEATHER_API_KEY || '').trim()

  // Method 1: Use OpenWeatherMap if API Key is configured
  if (apiKey) {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      )
      
      if (weatherRes.ok) {
        const wData = await weatherRes.json()
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
        )
        const fData = await forecastRes.json()

        const forecastDays = []
        if (fData && fData.list) {
          const daysMap = {}
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

          fData.list.forEach(item => {
            const date = new Date(item.dt * 1000)
            const dayName = dayNames[date.getDay()]
            if (!daysMap[dayName]) {
              daysMap[dayName] = {
                day: dayName,
                tempHigh: Math.round(item.main.temp_max),
                tempLow: Math.round(item.main.temp_min),
                condition: item.weather[0]?.main || 'Clear',
                pop: Math.round((item.pop || 0) * 100)
              }
            } else {
              daysMap[dayName].tempHigh = Math.max(daysMap[dayName].tempHigh, Math.round(item.main.temp_max))
              daysMap[dayName].tempLow = Math.min(daysMap[dayName].tempLow, Math.round(item.main.temp_min))
              if (item.pop) daysMap[dayName].pop = Math.max(daysMap[dayName].pop, Math.round(item.pop * 100))
            }
          })

          Object.values(daysMap).slice(0, 7).forEach(d => {
            forecastDays.push({
              day: d.day,
              tempHigh: d.tempHigh,
              tempLow: d.tempLow,
              condition: d.condition,
              rainProb: `${d.pop}%`
            })
          })
        }

        const advisories = generateAdvisories(wData.name, Math.round(wData.main.temp), wData.main.humidity, wData.weather[0]?.main || '')

        return res.json({
          success: true,
          isRealTime: true,
          provider: 'OpenWeatherMap',
          data: {
            city: wData.name,
            country: wData.sys.country || 'India',
            temp: Math.round(wData.main.temp),
            feelsLike: Math.round(wData.main.feels_like),
            condition: wData.weather[0]?.description ? (wData.weather[0].description.charAt(0).toUpperCase() + wData.weather[0].description.slice(1)) : 'Clear',
            humidity: wData.main.humidity,
            windSpeed: `${Math.round(wData.wind.speed * 3.6)} km/h`,
            rainfall: wData.rain ? `${wData.rain['1h'] || 0} mm` : '0 mm',
            uvIndex: Math.round(wData.main.temp) > 30 ? 8 : 6,
            forecast: forecastDays,
            farmingAdvisories: advisories
          }
        })
      }
    } catch (err) {
      console.warn('OpenWeatherMap API request failed, trying Open-Meteo real-time fallback:', err.message)
    }
  }

  // Method 2: Free Real-Time Weather via Open-Meteo & Nominatim Geocoding (No API Key Required!)
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
    const geoData = await geoRes.json()

    if (geoData && geoData.results && geoData.results.length > 0) {
      const location = geoData.results[0]
      const lat = location.latitude
      const lon = location.longitude
      const cityName = location.name
      const countryName = location.country || 'India'

      const meteoRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      )
      const mData = await meteoRes.json()

      if (mData && mData.current) {
        const temp = Math.round(mData.current.temperature_2m)
        const feelsLike = Math.round(mData.current.apparent_temperature)
        const humidity = Math.round(mData.current.relative_humidity_2m)
        const windSpeed = `${Math.round(mData.current.wind_speed_10m)} km/h`
        const rainAmount = `${mData.current.precipitation || 0} mm`
        const weatherCode = mData.current.weather_code

        const conditionStr = decodeWeatherCode(weatherCode)

        // Build 7-day forecast from Open-Meteo daily arrays
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const forecastDays = []

        if (mData.daily && mData.daily.time) {
          mData.daily.time.slice(0, 7).forEach((tStr, idx) => {
            const dObj = new Date(tStr)
            const dayName = dayNames[dObj.getDay()]
            const maxTemp = Math.round(mData.daily.temperature_2m_max[idx])
            const minTemp = Math.round(mData.daily.temperature_2m_min[idx])
            const rainProb = mData.daily.precipitation_probability_max ? `${mData.daily.precipitation_probability_max[idx]}%` : '20%'
            const dayCond = decodeWeatherCode(mData.daily.weather_code[idx])

            forecastDays.push({
              day: dayName,
              tempHigh: maxTemp,
              tempLow: minTemp,
              condition: dayCond,
              rainProb
            })
          })
        }

        const advisories = generateAdvisories(cityName, temp, humidity, conditionStr)

        return res.json({
          success: true,
          isRealTime: true,
          provider: 'Open-Meteo (Live)',
          data: {
            city: cityName,
            country: countryName,
            temp,
            feelsLike,
            condition: conditionStr,
            humidity,
            windSpeed,
            rainfall: rainAmount,
            uvIndex: temp > 30 ? 8 : temp > 25 ? 6 : 4,
            forecast: forecastDays,
            farmingAdvisories: advisories
          }
        })
      }
    }
  } catch (err) {
    console.warn('Open-Meteo live lookup failed, using offline fallback:', err.message)
  }

  // Method 3: Offline Fallback
  const mockWeatherData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'India',
    temp: 27,
    feelsLike: 29,
    condition: 'Partly Cloudy',
    humidity: 68,
    windSpeed: '14 km/h',
    rainfall: '12 mm',
    uvIndex: 6,
    forecast: [
      { day: 'Mon', tempHigh: 28, tempLow: 20, condition: 'Scattered Showers', rainProb: '70%' },
      { day: 'Tue', tempHigh: 29, tempLow: 21, condition: 'Partly Cloudy', rainProb: '20%' },
      { day: 'Wed', tempHigh: 30, tempLow: 21, condition: 'Sunny', rainProb: '10%' },
      { day: 'Thu', tempHigh: 27, tempLow: 19, condition: 'Heavy Rain', rainProb: '90%' },
      { day: 'Fri', tempHigh: 26, tempLow: 18, condition: 'Thunderstorm', rainProb: '85%' },
      { day: 'Sat', tempHigh: 28, tempLow: 20, condition: 'Partly Cloudy', rainProb: '30%' },
      { day: 'Sun', tempHigh: 30, tempLow: 22, condition: 'Sunny', rainProb: '0%' },
    ],
    farmingAdvisories: generateAdvisories(city, 27, 68, 'Partly Cloudy')
  }

  res.json({ success: true, isRealTime: false, provider: 'Offline Fallback', data: mockWeatherData })
})

function decodeWeatherCode(code) {
  if (code === 0) return 'Clear Sky'
  if (code === 1 || code === 2) return 'Partly Cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 51 && code <= 67) return 'Rain / Drizzle'
  if (code >= 80 && code <= 82) return 'Showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Partly Cloudy'
}

function generateAdvisories(city, temp, humidity, condition) {
  const advisories = []
  const condLower = condition.toLowerCase()

  if (condLower.includes('rain') || condLower.includes('shower') || condLower.includes('thunderstorm')) {
    advisories.push({
      title: 'Irrigation Pause Warning',
      text: `Rainfall detected in ${city}. Hold off irrigation for 48 hours to prevent waterlogging & root damage.`,
      level: 'warning'
    })
  } else if (temp > 34) {
    advisories.push({
      title: 'Heatwave Alert',
      text: `High ambient temperature of ${temp}°C in ${city}. Provide evening light irrigation to protect young crops.`,
      level: 'warning'
    })
  } else {
    advisories.push({
      title: 'Irrigation Schedule',
      text: `Weather conditions in ${city} are favorable (${temp}°C). Maintain standard watering schedule.`,
      level: 'success'
    })
  }

  if (humidity > 78) {
    advisories.push({
      title: 'Fungal Pathogen Risk',
      text: `High relative humidity (${humidity}%). Inspect crops for leaf spot, blast, and mildews.`,
      level: 'warning'
    })
  } else {
    advisories.push({
      title: 'Pesticide Spray Window',
      text: `Relative humidity (${humidity}%) is optimal for organic/chemical foliar sprays.`,
      level: 'success'
    })
  }

  advisories.push({
    title: 'Soil Moisture Advisory',
    text: `Good transpiration and canopy conditions recorded in ${city}.`,
    level: 'info'
  })

  return advisories
}

export default router
