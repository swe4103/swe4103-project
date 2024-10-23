import { getRecord, deleteRecord, updateRecord, filterRecords } from '#services/DatabaseService.js'

export const createNewProject = async project =>
  await saveRecord('Project', { id: uuidv4(), ...project })

export const getProjectById = async id => await getRecord('Project', id)

export const deleteProjectById = async id => deleteRecord('Project', id)

export const updateProjectById = async (id, data) => updateRecord('Project', id, data)

export const listProjectsByClassId = async ({ classId }) => {
  if (!classId) {
    throw new Error('classId must be provided.')
  }

  const query = `
    SELECT * FROM c 
    WHERE c.classId = @classId
  `.trim()

  const parameters = [{ name: '@classId', value: classId }]

  return filterRecords(PROJECT_COLLECTION, { query, parameters })
}
