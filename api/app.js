import app from '#app'
import config from '#config'

const port = config.port

// start the server
app.listen(port, () => console.log(`App listening on port ${port}`))
