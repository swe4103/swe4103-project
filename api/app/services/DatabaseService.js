import { CosmosClient } from '@azure/cosmos'

import config from '#config'

const USER_COLLECTION = 'User'
const PROJECT_COLLECTION = 'Project'

let database = null

export const initializeDatabase = () => {
  const endpoint = config.db.cosmos_endpoint
  const key = config.db.cosmos_key

  const client = new CosmosClient({ endpoint, key })
  database = client.database(config.db.cosmos_db_id)
}

export const getContainer = containerName => {
  if (!database) {
    throw new Error('Database not initialized')
  }
  switch (containerName) {
    case 'User':
      return database.container(USER_COLLECTION)
    case 'Project':
      return database.container(PROJECT_COLLECTION)
    default:
      throw new Error('Unknown record type')
  }
}

// CRUD Operations

// Save a record
export const saveRecord = async (containerName, record) => {
  const container = getContainer(containerName)
  try {
    const { resource } = await container.items.create(record)
    return resource
  } catch (error) {
    console.error(error.message)
    return null
  }
}

// Get a single record based on id
export const getRecord = async (containerName, id) => {
  const container = getContainer(containerName)
  try {
    const { resource } = await container.item('id', id).read()
    return resource
  } catch (error) {
    console.log(error.message)
    return null
  }
}

export const updateRecord = async (containerName, id, updatedData) => {
  const container = getContainer(containerName)
  try {
    const { resource: existingRecord } = await container.item(id).read()
    if (!existingRecord) {
      throw new Error('Record not found')
    }
    const updatedRecord = { ...existingRecord, ...updatedData }
    const { resource } = await container.items.upsert(updatedRecord)
    return resource
  } catch (error) {
    console.error(error.message)
    return null
  }
}

export const upsertRecord = async (containerName, record) => {
  const container = getContainer(containerName)
  const { resource } = await container.items.upsert(record)
  return resource
}

// Generic filter function to query records based on a given filter
export const filterRecords = async (containerName, filterQuery) => {
  const container = getContainer(containerName)

  try {
    const { resources } = await container.items
      .query(filterQuery, { enableCrossPartitionQuery: true })
      .fetchAll()
    return resources.length > 0 ? resources : null
  } catch (error) {
    console.log(error.message)
    return null
  }
}

// Get all records whose value matches the inputted value for the field name
export const listRecords = async (containerName, field, val) => {
  try {
    const query = {
      query: `SELECT * FROM c WHERE c.${field} = @value`,
      parameters: [{ name: '@value', value: val }],
    }
    return await filterRecords(containerName, query)
  } catch (error) {
    console.log(error.message)
    return null
  }
}

export const deleteRecord = async (containerName, id) => {
  const container = getContainer(containerName)
  try {
    const { resource } = await container.item(id).delete()
    if (!resource) {
      throw new Error(`Record with ID ${id} not found`)
    }
    return id
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error.message)
    return null
  }
}
