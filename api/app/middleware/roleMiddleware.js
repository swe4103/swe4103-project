export const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    const { user } = req

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' })
    }

    if (!allowedRoles.includes(user.role.split(','))) {
      return res.status(403).json({ message: 'Forbidden: Access denied' })
    }

    next()
  }
