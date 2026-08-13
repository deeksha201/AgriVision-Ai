import mongoose from 'mongoose'

const cropAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  soilData: {
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    temperature: Number,
    humidity: Number,
    ph: Number,
    rainfall: Number,
  },
  topRecommendation: {
    crop: String,
    confidence: Number,
    seasons: [String],
    tips: String,
    idealRanges: Object,
  },
  alternativeCrops: [
    {
      crop: String,
      confidence: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('CropAnalysis', cropAnalysisSchema)
