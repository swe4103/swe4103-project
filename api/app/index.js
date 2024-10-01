// app/index.js
import express from 'express'

import { syncDb } from '#services/db.js'

const app = express()
app.use(express.json())
;(async () => {
  try {
    await syncDb()
  } catch (error) {
    process.exit(1)
  }
})()

export default app
