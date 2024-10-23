import cors from 'cors'
import express from 'express'

import config from '#config'
import auth from '#routes/auth.js'
import classes from '#routes/classes.js'
import joy from '#routes/joy.js'
import projects from '#routes/projects.js'
import teams from '#routes/teams.js'
import users from '#routes/users.js'

const app = express()

// middleware
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
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
app.use('/api/joy', joy)
app.use('/api/classes', classes)
app.use('/api/teams', teams)
app.use('/api/projects', projects)

export default app
