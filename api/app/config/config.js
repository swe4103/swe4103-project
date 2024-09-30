import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const dbConfig = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || './database.sqlite',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_STORAGE || './database.sqlite',
    logging: false,
  },
}

const config = {
  port: process.env.PORT || 3000,
  logging: process.env.LOGGING === 'true',
  db: dbConfig[env],
}

export default config
