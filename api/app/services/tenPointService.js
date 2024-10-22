import { v4 as uuidv4 } from 'uuid'

import {
  getRecord,
  saveRecord,
  updateRecord,
  deleteRecord,
  listRecords,
} from '#services/databaseService.js'

export const createTenPoint = async tenPoint =>
  await saveRecord('TenPoint', { id: uuidv4(), ...tenPoint })

export const getTenPointById = async id => getRecord('TenPoint', id)

export const deleteTenPointById = async id => deleteRecord('TenPoint', id)

export const updateTenPointById = async (id, data) => updateRecord('TenPoint', id, data)

export const listTenPoints = async teamId => listRecords('TenPoint', id)
