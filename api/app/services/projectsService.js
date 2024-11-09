import { v4 as uuidv4 } from 'uuid'

import {
  getRecord,
  deleteRecord,
  updateRecord,
  filterRecords,
  saveRecord,
} from '#services/DatabaseService.js'

export const createNewProject = async project =>
  await saveRecord('Project', { id: uuidv4(), ...project })

export const getProjectById = async id => await getRecord('Project', id)

export const deleteProjectById = async id => await deleteRecord('Project', id)

export const updateProjectById = async (id, data) => await updateRecord('Project', id, data)

export const listProjectsByClassId = async ({ classId }) => {
  if (!classId) {
    throw new Error('classId must be provided.')
  }

  const query = `
    SELECT * FROM c 
    WHERE c.classId = @classId
  `.trim()

  const parameters = [{ name: '@classId', value: classId }]

  return await filterRecords('Project', { query, parameters })
}
