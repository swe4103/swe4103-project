import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const config = {
  env,
  port: process.env.PORT,
  db: {
    cosmos_endpoint: process.env.COSMOS_DB_URI,
    cosmos_key: process.env.COSMOS_DB_KEY,
    cosmos_db_id: process.env.COSMOS_DB_ID,
  },
}

export default config
