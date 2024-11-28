import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('listJoyRatings retrieves joy ratings successfully', async t => {
  const mockJoyRatings = [{ id: 'joy1' }, { id: 'joy2' }]
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#schemas/joy.js': {
      joyRatingsQuerySchema: {
        validate: () => ({ value: { userId: 'user123' } }),
      },
    },
    '#services/joyService.js': {
      listJoys: sinon.stub().resolves(mockJoyRatings),
    },
  })

  const mockReq = {
    query: { userId: 'user123' },
    params: { listMembers: 'false' },
  }
  const mockRes = createResponse()

  await service.listJoyRatings(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockJoyRatings))
})

test('listJoyRatings retrieves team member joy ratings successfully', async t => {
  const mockJoyRatings = [{ id: 'joy1' }, { id: 'joy2' }]
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#schemas/joy.js': {
      joyRatingsQuerySchema: {
        validate: () => ({ value: { teamId: 'team123' } }),
      },
    },
    '#services/joyService.js': {
      listTeamMemberJoys: sinon.stub().resolves(mockJoyRatings),
    },
  })

  const mockReq = {
    query: { teamId: 'team123' },
    params: { listMembers: 'true' },
  }
  const mockRes = createResponse()

  await service.listJoyRatings(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockJoyRatings))
})

test('listJoyRatings handles validation error', async t => {
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#schemas/joy.js': {
      joyRatingsQuerySchema: {
        validate: () => ({ error: { details: [{ message: 'Invalid query parameters' }] } }),
      },
    },
  })

  const mockReq = {
    query: {},
  }
  const mockRes = createResponse()

  await service.listJoyRatings(mockReq, mockRes)

  t.true(mockRes.status.calledWith(400))
  t.true(mockRes.json.calledWith({ message: 'Invalid query parameters' }))
})

test('getJoyRating retrieves rating successfully', async t => {
  const mockJoyRating = { id: 'joy123', rating: 5 }
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#services/joyService.js': {
      getJoyById: sinon.stub().resolves(mockJoyRating),
    },
  })

  const mockReq = {
    params: { id: 'joy123' },
  }
  const mockRes = createResponse()

  await service.getJoyRating(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockJoyRating))
})

test('getJoyRating handles non-existent rating', async t => {
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#services/joyService.js': {
      getJoyById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'nonexistent' },
  }
  const mockRes = createResponse()

  await service.getJoyRating(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Joy rating not found' }))
})

test('createJoyRating creates rating successfully', async t => {
  const mockJoyRating = { id: 'joy123', rating: 5 }
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#schemas/joy.js': {
      joyRatingSchema: {
        validate: () => ({ value: { rating: 5 } }),
      },
    },
    '#services/joyService.js': {
      createJoy: sinon.stub().resolves(mockJoyRating),
    },
  })

  const mockReq = {
    body: { rating: 5 },
  }
  const mockRes = createResponse()

  await service.createJoyRating(mockReq, mockRes)

  t.true(mockRes.status.calledWith(201))
  t.true(mockRes.json.calledWith(mockJoyRating))
})

test('updateJoyRating updates rating successfully', async t => {
  const mockJoyRating = { id: 'joy123', rating: 4 }
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#schemas/joy.js': {
      updateJoyRatingSchema: {
        validate: () => ({ value: { rating: 4 } }),
      },
    },
    '#services/joyService.js': {
      updateJoyById: sinon.stub().resolves(mockJoyRating),
    },
  })

  const mockReq = {
    params: { id: 'joy123' },
    body: { rating: 4 },
  }
  const mockRes = createResponse()

  await service.updateJoyRating(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockJoyRating))
})

test('deleteJoyRating deletes rating successfully', async t => {
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#services/joyService.js': {
      deleteJoyById: sinon.stub().resolves('joy123'),
    },
  })

  const mockReq = {
    params: { id: 'joy123' },
  }
  const mockRes = createResponse()

  await service.deleteJoyRating(mockReq, mockRes)

  t.true(mockRes.status.calledWith(204))
  t.true(mockRes.send.called)
})

test('deleteJoyRating handles non-existent rating', async t => {
  const { service, createResponse } = await setupTest('#controllers/joyController.js', {
    '#services/joyService.js': {
      deleteJoyById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'joy123' },
  }
  const mockRes = createResponse()

  await service.deleteJoyRating(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Joy rating not found' }))
})
