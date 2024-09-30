import app from './app/index.js'

const port = process.env.PORT || '3000'

app.listen(port, () => console.log(`App listening on port ${port}`))
