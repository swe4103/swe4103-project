import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import config from '#config'
import { getUserByEmail } from '#models/userModel.js'
import { blacklist } from '#services/nodeCache.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, {
      expiresIn: '24h',
    })

    res.json({
      token,
      user: {
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

export const logout = (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(400).json({ message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(400).json({ message: 'Token missing in authorization header' })
  }

  blacklist(token)
  res.status(200).json({ message: 'Logged out successfully' })
}

export const register = (req, res) => {
  console.log('not implemented')
}
