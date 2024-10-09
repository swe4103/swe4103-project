import config from '../config/config'

const USER_COLLECTION = 'User'
const PROJECT_COLLECTION = 'Project'

const { CosmosClient } = require('@azure/cosmos')

const endpoint = config.db.cosmos_endpoint
const key = config.db.cosmos_uri

const client = new CosmosClient({
  endpoint,
  key,
})

const database = client.database(config.db.cosmos_db_id)

function getContainer(type) {
  switch (type) {
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
async function saveRecord(record) {
  const container = getContainer(record.constructor.name)
  try {
    const { resource } = await container.items.create(record)
    return true
  } catch (error) {
    console.error(error.message)
    return false
  }
}

// Get a single record based on id
async function getRecord(type, id) {
  const container = getContainer(type)
  try {
    const { resource } = await container.item('id', id).read()
    return resource
  } catch (error) {
    console.log(error.message)
    return null
  }
}

// Get all records whose value matches the inputted value for the field name
async function listRecords(type, field, val) {
  if (field === null || id === null) {
    console.log('Error: Both field and value must be included.') // add log error handling
    return null
  }
  const container = getContainer(type)
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

module.exports = { saveRecord, getRecord, listRecords }
