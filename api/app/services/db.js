// services/db.js
import { Sequelize } from 'sequelize'

import config from '#config'

const sequelize = new Sequelize(config.db)

export const syncDb = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database connection established')
  } catch (error) {
    throw error
  }
}

export default sequelize
