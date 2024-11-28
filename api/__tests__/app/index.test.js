import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import app from '#app'
import config from '#config'

test.before(() => {
  sinon.stub(config, 'allowedOrigins').value(['http://example.com'])
})

test('CORS allows requests from configured origins', async t => {
  const response = await request(app)
    .options('/api/auth')
    .set('Origin', 'http://example.com')
    .set('Access-Control-Request-Method', 'GET')

  t.is(response.status, 204)
  t.is(response.headers['access-control-allow-origin'], 'http://example.com')
})

test('CORS blocks requests from disallowed origins', async t => {
  const response = await request(app).get('/api/auth').set('Origin', 'http://notallowed.com')

  t.is(response.status, 500)
  t.true(response.text.includes('Not allowed by CORS'))
})

test('GET /api/auth route is mounted correctly', async t => {
  const response = await request(app).get('/api/auth/validate-token')
  t.not(response.status, 404)
})

test('GET /api/users route is mounted correctly', async t => {
  const response = await request(app).get('/api/users/user-123')
  t.not(response.status, 404)
})

test('GET /api/classes route is mounted correctly', async t => {
  const response = await request(app).get('/api/classes/class-123')
  t.not(response.status, 404)
})

test('GET /api/joy route is mounted correctly', async t => {
  const response = await request(app).get('/api/joy')
  t.not(response.status, 404)
})

test('GET /api/teams route is mounted correctly', async t => {
  const response = await request(app).get('/api/teams/team-123')
  t.not(response.status, 404)
})

test('GET /api/projects route is mounted correctly', async t => {
  const response = await request(app).get('/api/projects/project-123')
  t.not(response.status, 404)
})

test('Handles invalid routes with 404', async t => {
  const response = await request(app).get('/api/unknown')
  t.is(response.status, 404)
})
