import express from 'express'

import auth from '#routes/auth.js'

const app = express()

// middleware
app.use(express.json())

// routes
app.use('/api/auth', auth)

export default app
