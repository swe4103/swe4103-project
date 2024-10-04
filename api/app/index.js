import express from 'express'

import { syncDb } from '#services/db.js'

const app = express()
app.use(express.json())

export default app
