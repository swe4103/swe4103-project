import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('createProject creates a new project successfully', async t => {
  const mockProject = { id: 'project123', name: 'Test Project' }
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#schemas/projects.js': {
      projectSchema: {
        validate: () => ({ value: { name: 'Test Project' } }),
      },
    },
    '#services/projectsService.js': {
      createNewProject: sinon.stub().resolves(mockProject),
    },
  })

  const mockReq = {
    body: { name: 'Test Project' },
  }
  const mockRes = createResponse()

  await service.createProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(201))
  t.true(mockRes.json.calledWith(mockProject))
})

test('createProject handles validation error', async t => {
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#schemas/projects.js': {
      projectSchema: {
        validate: () => ({ error: { details: [{ message: 'Invalid project data' }] } }),
      },
    },
  })

  const mockReq = {
    body: {},
  }
  const mockRes = createResponse()

  await service.createProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(400))
  t.true(mockRes.json.calledWith({ message: 'Invalid project data' }))
})

test('listProjects retrieves projects successfully', async t => {
  const mockProjects = [{ id: 'project1' }, { id: 'project2' }]
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#schemas/projects.js': {
      listProjectsQuerySchema: {
        validate: () => ({ value: { classId: 'class123' } }),
      },
    },
    '#services/projectsService.js': {
      listProjectsByClassId: sinon.stub().resolves(mockProjects),
    },
  })

  const mockReq = {
    query: { classId: 'class123' },
  }
  const mockRes = createResponse()

  await service.listProjects(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockProjects))
})

test('listProjects handles empty result', async t => {
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#schemas/projects.js': {
      listProjectsQuerySchema: {
        validate: () => ({ value: { classId: 'class123' } }),
      },
    },
    '#services/projectsService.js': {
      listProjectsByClassId: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    query: { classId: 'class123' },
  }
  const mockRes = createResponse()

  await service.listProjects(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith([]))
})

test('getProject retrieves project successfully', async t => {
  const mockProject = { id: 'project123', name: 'Test Project' }
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#services/projectsService.js': {
      getProjectById: sinon.stub().resolves(mockProject),
    },
  })

  const mockReq = {
    params: { id: 'project123' },
  }
  const mockRes = createResponse()

  await service.getProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockProject))
})

test('getProject handles non-existent project', async t => {
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#services/projectsService.js': {
      getProjectById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'nonexistent' },
  }
  const mockRes = createResponse()

  await service.getProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Project not found' }))
})

test('updateProject updates project successfully', async t => {
  const mockProject = { id: 'project123', name: 'Updated Project' }
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#schemas/projects.js': {
      updateProjectSchema: {
        validate: () => ({ value: { name: 'Updated Project' } }),
      },
    },
    '#services/projectsService.js': {
      updateProjectById: sinon.stub().resolves(mockProject),
    },
  })

  const mockReq = {
    params: { id: 'project123' },
    body: { name: 'Updated Project' },
  }
  const mockRes = createResponse()

  await service.updateProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockProject))
})

test('deleteProject deletes project successfully', async t => {
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#services/projectsService.js': {
      deleteProjectById: sinon.stub().resolves('project123'),
    },
  })

  const mockReq = {
    params: { id: 'project123' },
  }
  const mockRes = createResponse()

  await service.deleteProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(204))
  t.true(mockRes.send.called)
})

test('deleteProject handles non-existent project', async t => {
  const { service, createResponse } = await setupTest('#controllers/projectsController.js', {
    '#services/projectsService.js': {
      deleteProjectById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'project123' },
  }
  const mockRes = createResponse()

  await service.deleteProject(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Project not found' }))
})
