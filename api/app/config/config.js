import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const config = {
  env,
  port: process.env.PORT,
  // add more things over time
}

export default config
