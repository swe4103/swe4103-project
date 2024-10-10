import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import config from '#config'
import { Roles } from '#constants/roles.js'
import { blacklist } from '#services/blacklistCache.js'
import { getUserByEmail } from '#services/userService.js'

export default {
  login: async (req, res) => {
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
  },
  logout: async (req, res) => {
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
  },
  register: async (req, res) => {
    // step 1: get invitee from auth middleware
    const invitee = req.invitee
    const { displayName, password } = req.body

    try {
      // step 2: hash the password
      const hashedPassword = await bcrypt.hash(password, 10)

      // step 3: handle registration based on role
      // if instrcutor, then add to db
      if (invitee.role === Roles.INSTRUCTOR) {
        // TODO add instructor entry in the database
      } else if (invitee.role === Roles.STUDENT) {
        // if student then add student to db then redirect
        if (!invitee.projectId) {
          return res
            .status(400)
            .json({ message: 'Project ID is required for student registration' })
        }
        // TODO add student entry in the database
      } else {
        return res.status(400).json({ message: 'Bad request' })
      }
      return res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
      console.error('Error registering user:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
