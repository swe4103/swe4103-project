import dotenv from 'dotenv'
dotenv.config()

import app from '#app'
import config from '#config'
import { initializeDatabase } from '#services/DatabaseService.js'

const port = config.port

// initalize the database
initializeDatabase()

// start the server
app.listen(port, () => console.log(`App listening on port ${port}`))
