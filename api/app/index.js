import express from 'express'

import { syncDatabase } from '#services/db.js'

const app = express()
app.use(express.json())
;(async () => {
  await syncDatabase()
})()

export default app
