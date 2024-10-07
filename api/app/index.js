import express from 'express'

import auth from '#routes/auth.js'
import users from '#routes/users.js'

const app = express()

// middleware
app.use(express.json())

// routes
app.use('/api/auth', auth)
app.use('/api/users', users)

export default app
