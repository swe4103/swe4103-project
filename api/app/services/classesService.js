import { getRecord, deleteRecord, updateRecord } from '#services/DatabaseService.js'

export const createNewClass = async clazz => await saveRecord('Class', { id: uuidv4(), ...clazz })

export const getClassById = async id => await getRecord('Class', id)

export const deleteClassById = async id => deleteRecord('Class', id)

export const updateClassById = async (id, data) => updateRecord('Class', id, data)
