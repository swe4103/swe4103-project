import jwt from 'jsonwebtoken'

import config from '#config'
import { isBlacklisted } from '#services/blacklistCache.js'

export const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  if (isBlacklisted(token)) {
    return res.status(401).json({ message: 'Token is blacklisted' })
  }

  jwt.verify(token, config.jwtLoginSecret, (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

export const inviteJWT = (req, res, next) => {
  const { token } = req.query
  if (!token) {
    return res.status(401).json({ message: 'Invite token missing' })
  }

  if (isBlacklisted(token)) {
    return res.status(401).json('Invite token is blacklisted')
  }

  jwt.verify(token, config.jwtInviteSecret, (error, invitee) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.invitee = invitee
    next()
  })
}
