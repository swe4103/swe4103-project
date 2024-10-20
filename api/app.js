import app from '#app'
import config from '#config'
import { initializeDatabase } from '#services/databaseService.js'

const port = config.port

// initalize the database
initializeDatabase()

// start the server
app.listen(port, () => console.log(`App listening on port ${port}`))
