import cors from 'cors'
import express from 'express'

import auth from '#routes/auth.js'
import users from '#routes/users.js'

const app = express()

// middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173']

app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  }),
)

// routes
app.use('/api/auth', auth)
app.use('/api/users', users)

export default app
