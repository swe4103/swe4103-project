import { Sequelize } from 'sequelize'

import config from '#config'

const sequelize = new Sequelize(config.db)

export const syncDatabase = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database connection established and models synced')
  } catch (error) {
    console.error('Unable to connect to database:', error)
    process.exit(1)
  }
}

export default sequelize
