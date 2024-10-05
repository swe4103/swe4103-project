import jwt from 'jsonwebtoken'

import { isBlacklisted } from '#services/cacheService.js'

export const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  if (isBlacklisted(token)) {
    return res.status(401).json({ message: 'Token is blacklisted' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}
