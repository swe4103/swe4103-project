import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const dbConfig = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE,
    logging: false,
  },
}

const config = {
  env,
  port: process.env.PORT,
  db: dbConfig[env],
}

export default config
