import { CosmosClient } from '@azure/cosmos'

import config from '#config'

const USER_COLLECTION = 'User'
const PROJECT_COLLECTION = 'Project'

const endpoint = config.db.cosmos_endpoint
const key = config.db.cosmos_key

const client = new CosmosClient({
  endpoint,
  key,
})

const database = client.database(config.db.cosmos_db_id)

export const getContainer = containerName => {
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
    return true
  } catch (error) {
    console.error(error.message)
    return false
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

// Generic filter function to query records based on a given filter
export const filterRecords = async (containerName, filterQuery) => {
  const container = getContainer(containerName)

  try {
    const { resources } = await container.items.query(filterQuery).fetchAll()
    return resources.length > 0 ? resources : null
  } catch (error) {
    console.log(error.message)
    return null
  }
}

// Get all records whose value matches the inputted value for the field name
export const listRecords = async (containerName, field, val) => {
  if (field === null || id === null) {
    console.log('Error: Both field and value must be included.') // add log error handling
    return null
  }
  const container = getContainer(containerName)
  try {
    if (field === null || id === null) {
      const { resources } = await container.items
        .query(
          {
            query: `SELECT * FROM c WHERE c.${field} = @value`,
            parameters: [{ name: '@value', value: val }],
          },
          {
            enableCrossPartitionQuery: true, // enable cross partition query so that multiple items can be fetched
          },
        )
        .fetchAll()

      return resources
    }
  } catch (error) {
    console.log(error.message)
    return null
  }
}
