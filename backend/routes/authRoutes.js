import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

const router = express.Router()

// In-memory fallback store for offline/unreachable DB mode
const localUsersStore = []

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if MongoDB is connected (readyState === 1)
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' })
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        farmLocation: '',
        farmSize: '',
        primaryCrop: '',
      })

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'agrivision_secret',
        { expiresIn: '7d' }
      )

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          farmLocation: user.farmLocation || '',
          farmSize: user.farmSize || '',
          primaryCrop: user.primaryCrop || '',
        },
      })
    } else {
      // In-memory fallback mode
      const existingUser = localUsersStore.find(u => u.email === email)
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' })
      }

      const newUser = {
        id: 'local_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        farmLocation: '',
        farmSize: '',
        primaryCrop: '',
      }
      localUsersStore.push(newUser)

      const token = jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET || 'agrivision_secret',
        { expiresIn: '7d' }
      )

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (Local session)',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          farmLocation: newUser.farmLocation,
          farmSize: newUser.farmSize,
          primaryCrop: newUser.primaryCrop,
        },
      })
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' })
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'agrivision_secret',
        { expiresIn: '7d' }
      )

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          farmLocation: user.farmLocation || '',
          farmSize: user.farmSize || '',
          primaryCrop: user.primaryCrop || '',
        },
      })
    } else {
      // In-memory fallback login check
      const user = localUsersStore.find(u => u.email === email)

      if (!user) {
        // Create demo account automatically if not existing for smooth testing
        const hashedPassword = await bcrypt.hash(password, 10)
        const demoUser = {
          id: 'local_' + Date.now(),
          name: email.split('@')[0],
          email,
          password: hashedPassword,
          farmLocation: 'Bangalore, Karnataka',
          farmSize: '5 Acres',
          primaryCrop: 'Rice',
        }
        localUsersStore.push(demoUser)

        const token = jwt.sign(
          { id: demoUser.id },
          process.env.JWT_SECRET || 'agrivision_secret',
          { expiresIn: '7d' }
        )

        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            farmLocation: demoUser.farmLocation,
            farmSize: demoUser.farmSize,
            primaryCrop: demoUser.primaryCrop,
          },
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' })
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'agrivision_secret',
        { expiresIn: '7d' }
      )

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          farmLocation: user.farmLocation || '',
          farmSize: user.farmSize || '',
          primaryCrop: user.primaryCrop || '',
        },
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message })
  }
})

// Update User Profile Route
router.put('/profile', async (req, res) => {
  try {
    const { id, name, farmLocation, farmSize, primaryCrop } = req.body

    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' })
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      if (name) user.name = name
      if (farmLocation !== undefined) user.farmLocation = farmLocation
      if (farmSize !== undefined) user.farmSize = farmSize
      if (primaryCrop !== undefined) user.primaryCrop = primaryCrop

      await user.save()

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          farmLocation: user.farmLocation,
          farmSize: user.farmSize,
          primaryCrop: user.primaryCrop,
        },
      })
    } else {
      const userIndex = localUsersStore.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        if (name) localUsersStore[userIndex].name = name
        if (farmLocation !== undefined) localUsersStore[userIndex].farmLocation = farmLocation
        if (farmSize !== undefined) localUsersStore[userIndex].farmSize = farmSize
        if (primaryCrop !== undefined) localUsersStore[userIndex].primaryCrop = primaryCrop

        return res.json({
          success: true,
          message: 'Profile updated successfully (Local session)',
          user: {
            id: localUsersStore[userIndex].id,
            name: localUsersStore[userIndex].name,
            email: localUsersStore[userIndex].email,
            farmLocation: localUsersStore[userIndex].farmLocation,
            farmSize: localUsersStore[userIndex].farmSize,
            primaryCrop: localUsersStore[userIndex].primaryCrop,
          },
        })
      }

      // If user not in local store, update/create fallback object
      const fallbackUser = {
        id,
        name: name || 'Farmer',
        email: 'user@example.com',
        farmLocation: farmLocation || '',
        farmSize: farmSize || '',
        primaryCrop: primaryCrop || '',
      }
      localUsersStore.push(fallbackUser)

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: fallbackUser,
      })
    }
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ success: false, message: 'Server error updating profile', error: error.message })
  }
})

export default router
