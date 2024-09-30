import request from 'supertest'

import app from '../app/index.js'

describe('Test Express App', () => {
  it('should respond with a 200 status code on root endpoint', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(404)
  })
})
