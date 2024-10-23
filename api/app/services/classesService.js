import { getRecord, deleteRecord, updateRecord, filterRecords } from '#services/DatabaseService.js'

export const createNewClass = async clazz => await saveRecord('Class', { id: uuidv4(), ...clazz })

export const getClassById = async id => await getRecord('Class', id)

export const deleteClassById = async id => deleteRecord('Class', id)

export const updateClassById = async (id, data) => updateRecord('Class', id, data)

export const listClassesByIds = async ({ teamId, projectId }) => {
  if (!teamId && !projectId) {
    throw new Error('Either teamId or projectId must be provided.')
  }

  const query = `
    SELECT * FROM c 
    WHERE 
      ${teamId ? 'c.teamId = @teamId' : ''}
      ${teamId && projectId ? 'AND' : ''}
      ${projectId ? 'c.projectId = @projectId' : ''}
  `.trim()

  const parameters = [
    teamId && { name: '@teamId', value: teamId },
    projectId && { name: '@projectId', value: projectId },
  ].filter(Boolean)

  return filterRecords(CLASS_COLLECTION, { query, parameters })
}
