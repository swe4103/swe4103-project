import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
  getUserByEmail,
  createUser,
  updatePassword,
  getUserById,
} from '../services/usersService.js'

import config from '#config'
import Roles from '#constants/roles.js'
import { changePasswordSchema } from '#schemas/changePasswordSchema.js'
import { registerSchema } from '#schemas/users.js'
import { blacklist, isBlacklisted } from '#services/blacklistCache.js'

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

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtLoginSecret, {
      expiresIn: '1d',
    })
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = async (req, res) => {
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

export const register = async (req, res) => {
  const { invitee } = req

  const { error, value } = registerSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const { displayName, password } = value

  if (invitee.role === Roles.STUDENT && !invitee.teamId) {
    return res.status(400).json({ message: 'Team ID is required for student registration' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser({
      email: invitee.email,
      displayName,
      password: hashedPassword,
      role: invitee.role,
      ...(invitee.role === Roles.STUDENT && { groups: [invitee.teamId] }),
    })
    blacklist(req.query.token)
    return res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const validateToken = (req, res) => {
  const { token, type } = req.query
  if (!token || !type) {
    return res.status(400).json({ message: 'Token and type are required' })
  }

  const secret = type === 'auth' ? config.jwtAuthSecret : config.jwtInviteSecret
  try {
    const decoded = jwt.verify(token, secret)
    if (isBlacklisted(token)) {
      return res.json({ valid: false, error: 'Token is blacklisted' })
    }
    return res.json({ valid: true, decoded })
  } catch (error) {
    return res.json({ valid: false, error: 'Invalid or expired token' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    const { error } = changePasswordSchema.validate({
      currentPassword,
      newPassword,
      confirmPassword,
    })
    if (error) return res.status(400).json({ message: error.details[0].message })

    const userId = req.user.id

    const user = await getUserById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await updatePassword(userId, hashedNewPassword)

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error('Error changing password:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
