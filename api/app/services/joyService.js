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
  if (!userId && !teamId) {
    throw new Error('Either userId or teamId must be provided.')
  }

  const query = `
    SELECT * FROM c 
    WHERE 
      ${userId ? 'c.userId = @userId' : ''}
      ${userId && teamId ? 'AND' : ''}
      ${teamId ? 'c.teamId = @teamId' : ''}
      ${fromDate ? 'AND c.date >= @fromDate' : ''}
      ${toDate ? 'AND c.date <= @toDate' : ''}
  `.trim()

  const parameters = [
    userId && { name: '@userId', value: userId },
    teamId && { name: '@teamId', value: teamId },
    fromDate && { name: '@fromDate', value: fromDate },
    toDate && { name: '@toDate', value: toDate },
  ].filter(Boolean)

  return filterRecords('JoyRatings', { query, parameters })
}
