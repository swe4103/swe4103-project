import express from 'express'

import { syncDb } from '#services/db.js'

const app = express()
app.use(express.json())
;(async () => {
  try {
    await syncDb()
  } catch (error) {
    console.error(`Unable to sync database: ${error}`)
    process.exit(1)
  }
})()

export default app
