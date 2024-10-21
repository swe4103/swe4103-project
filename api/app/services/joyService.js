import { v4 as uuidv4 } from 'uuid'

import {
  filterRecords,
  getRecord,
  saveRecord,
  updateRecord,
  deleteRecord,
} from '#services/DatabaseService.js'

export const createJoy = async joyRating =>
  await saveRecord('JoyRating', { id: uuidv4(), ...joyRating })

export const getJoyById = async id => getRecord('JoyRating', id)

export const deleteJoyById = async id => deleteRecord('JoyRating', id)

export const updateJoyById = async (id, data) => updateRecord('JoyRating', id, data)

export const listJoys = async ({ userId, teamId, fromDate, toDate }) => {
  const query = `
    SELECT * FROM c 
    WHERE c.userId = @userId AND c.teamId = @teamId
    ${fromDate ? 'AND c.date >= @fromDate' : ''}
    ${toDate ? 'AND c.date <= @toDate' : ''}
  `.trim()

  const parameters = [
    { name: '@userId', value: userId },
    { name: '@teamId', value: teamId },
    fromDate && { name: '@fromDate', value: fromDate },
    toDate && { name: '@toDate', value: toDate },
  ].filter(Boolean)

  return filterRecords('JoyRatings', { query, parameters })
}
