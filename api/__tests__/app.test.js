import test from 'ava'
import esmock from 'esmock'
import sinon from 'sinon'

test.beforeEach(async t => {
  const initializeDatabaseStub = sinon.stub().resolves()
  const listenStub = sinon.stub()

  const { service } = await esmock('#app.js', {
    '#services/DatabaseService.js': {
      initializeDatabase: initializeDatabaseStub,
    },
    '#app': {
      listen: listenStub,
    },
    '#config': {
      port: 3000,
    },
  })

  t.context = { service, initializeDatabaseStub, listenStub }
})

test('initializes the database before starting the server', t => {
  const { initializeDatabaseStub, listenStub } = t.context
  t.true(initializeDatabaseStub.calledOnce, 'initializeDatabase should be called exactly once')
  t.true(listenStub.calledOnce, 'app.listen should be called exactly once')
})

test('starts the server on the correct port', t => {
  const { listenStub } = t.context
  const [portArg, callbackArg] = listenStub.firstCall.args
  t.is(portArg, 3000, 'app.listen should be called with the correct port (3000)')
  const consoleStub = sinon.stub(console, 'log')
  callbackArg()
  t.true(consoleStub.calledWith('App listening on port 3000'))
  consoleStub.restore()
})
