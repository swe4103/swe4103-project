import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('createClass creates a new class successfully', async t => {
  const mockClass = { id: 'class123', name: 'Test Class', instructorId: 'instructor123' }
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#schemas/classes.js': {
      classSchema: {
        validate: () => ({ value: { name: 'Test Class', instructorId: 'instructor123' } }),
      },
    },
    '#services/classesService.js': {
      createNewClass: sinon.stub().resolves(mockClass),
    },
  })

  const mockReq = {
    body: { name: 'Test Class', instructorId: 'instructor123' },
  }
  const mockRes = createResponse()

  await service.createClass(mockReq, mockRes)

  t.true(mockRes.status.calledWith(201))
  t.true(mockRes.json.calledWith(mockClass))
})

test('listClasses retrieves classes for instructor successfully', async t => {
  const mockClasses = [{ id: 'class1' }, { id: 'class2' }]
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#schemas/classes.js': {
      listClassesQuerySchema: {
        validate: () => ({ value: { instructorId: 'instructor123' } }),
      },
    },
    '#services/classesService.js': {
      listClassesByIds: sinon.stub().resolves(mockClasses),
    },
  })

  const mockReq = {
    user: { role: 'INSTRUCTOR' },
    query: { instructorId: 'instructor123' },
  }
  const mockRes = createResponse()

  await service.listClasses(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockClasses))
})

test('listClasses retrieves classes for student successfully', async t => {
  const mockClasses = [{ id: 'class1' }, { id: 'class2' }]
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#services/classesService.js': {
      listClassesByStudentId: sinon.stub().resolves(mockClasses),
    },
  })

  const mockReq = {
    user: { role: 'STUDENT', id: 'student123' },
  }
  const mockRes = createResponse()

  await service.listClasses(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockClasses))
})

test('listStudentClasses retrieves student classes successfully', async t => {
  const mockClasses = [{ id: 'class1' }, { id: 'class2' }]
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#schemas/classes.js': {
      listClassesQuerySchema: {
        validate: () => ({ value: { studentId: 'student123' } }),
      },
    },
    '#services/classesService.js': {
      listClassesByStudentId: sinon.stub().resolves(mockClasses),
    },
  })

  const mockReq = {
    user: { id: 'student123' },
    query: { studentId: 'student123' },
  }
  const mockRes = createResponse()

  await service.listStudentClasses(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockClasses))
})

test('getClass retrieves class successfully', async t => {
  const mockClass = { id: 'class123', name: 'Test Class' }
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#services/classesService.js': {
      getClassById: sinon.stub().resolves(mockClass),
    },
  })

  const mockReq = {
    params: { id: 'class123' },
  }
  const mockRes = createResponse()

  await service.getClass(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockClass))
})

test('getClass handles non-existent class', async t => {
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#services/classesService.js': {
      getClassById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'nonexistent' },
  }
  const mockRes = createResponse()

  await service.getClass(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Class not found' }))
})

test('updateClass updates class successfully', async t => {
  const mockClass = { id: 'class123', name: 'Updated Class' }
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#schemas/classes.js': {
      updateClassSchema: {
        validate: () => ({ value: { name: 'Updated Class' } }),
      },
    },
    '#services/classesService.js': {
      updateClassById: sinon.stub().resolves(mockClass),
    },
  })

  const mockReq = {
    params: { id: 'class123' },
    body: { name: 'Updated Class' },
  }
  const mockRes = createResponse()

  await service.updateClass(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockClass))
})

test('deleteClass deletes class successfully', async t => {
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#services/classesService.js': {
      deleteClassById: sinon.stub().resolves('class123'),
    },
  })

  const mockReq = {
    params: { id: 'class123' },
  }
  const mockRes = createResponse()

  await service.deleteClass(mockReq, mockRes)

  t.true(mockRes.status.calledWith(204))
  t.true(mockRes.send.called)
})

test('deleteClass handles non-existent class', async t => {
  const { service, createResponse } = await setupTest('#controllers/classesController.js', {
    '#services/classesService.js': {
      deleteClassById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'class123' },
  }
  const mockRes = createResponse()

  await service.deleteClass(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Class not found' }))
})
