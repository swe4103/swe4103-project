import sinon from 'sinon'

export const createDatabaseStubs = () => ({
  saveRecord: sinon.stub(),
  getRecord: sinon.stub(),
  deleteRecord: sinon.stub(),
  updateRecord: sinon.stub(),
  listRecords: sinon.stub(),
  filterRecords: sinon.stub(),
  upsertRecord: sinon.stub(),
})
