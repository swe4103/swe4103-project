import express from 'express'

import { syncDatabase } from '#db'

const app = express()
app.use(express.json())
;(async () => {
  await syncDatabase()
})()

export default app
