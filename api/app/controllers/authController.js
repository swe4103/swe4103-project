import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import config from '#config'
import Roles from '#constants/roles.js'
import { registerSchema } from '#schemas/users.js'
import { blacklist, isBlacklisted } from '#services/blacklistCache.js'
import { getRecord, upsertRecord } from '#services/DatabaseService.js'
import { getUserByEmail, createUser } from '#services/usersService.js'

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
        groups: user.groups,
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

  if (invitee.role === Roles.STUDENT && !invitee.classId) {
    return res.status(400).json({ message: 'Class ID is required for student registration' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser({
      email: invitee.email,
      displayName,
      password: hashedPassword,
      role: invitee.role,
      ...(invitee.role === Roles.STUDENT),
    })
    blacklist(req.query.token)
    try {
      const clazz = await getRecord('Class', invitee.classId)
      clazz.students = [...new Set([...(clazz.students || []), invitee.id])]
      await upsertRecord('Class', clazz)
    } catch (error) {
      console.error('Error updating class:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }

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
