import { getRecord, deleteRecord, updateRecord } from '#services/DatabaseService.js'

export const createNewProject = async project =>
  await saveRecord('Project', { id: uuidv4(), ...project })

export const getProjectById = async id => await getRecord('Project', id)

export const deleteProjectById = async id => deleteRecord('Project', id)

export const updateProjectById = async (id, data) => updateRecord('Project', id, data)
