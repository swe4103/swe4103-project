import express from 'express'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

const createAuthMiddleware = () => sinon.stub().callsFake((req, res, next) => next())

export const setupRouteTest = async options => {
  const { routePath, controllerPath, basePath, controllerStubs } = options

  const app = express()
  app.use(express.json())

  const authMiddleware = createAuthMiddleware()

  const { service: router } = await setupTest(routePath, {
    '#middleware/authMiddleware.js': {
      authJWT: authMiddleware,
      inviteJWT: authMiddleware,
    },
    '#middleware/roleMiddleware.js': {
      authorizeRoles: () => authMiddleware,
    },
    [controllerPath]: controllerStubs,
  })

  app.use(`/api/${basePath}`, router.default)

  return {
    app,
    auth: authMiddleware,
    stubs: controllerStubs,
  }
}
