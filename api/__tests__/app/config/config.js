// test/config.test.js
import test from 'ava'

import config from '#config'

test('should set the environment to test', t => {
  t.is(config.env, 'test')
})

test('should load test configuration values', t => {
  t.is(config.jwtLoginSecret, 'test_login_secret')
  t.is(config.jwtInviteSecret, 'test_invite_secret')
  t.is(config.db.cosmos_endpoint, 'test_cosmos_uri')
  t.is(config.db.cosmos_key, 'test_cosmos_key')
  t.is(config.db.cosmos_db_id, 'test_cosmos_id')
})
