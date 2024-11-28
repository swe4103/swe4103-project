import test from 'ava'

test('config provides correct test environment values', async t => {
  const config = (await import('#config')).default

  t.is(config.env, 'test')
  t.is(config.port, 3000)
  t.is(config.jwtLoginSecret, 'test_login_secret')
  t.is(config.jwtInviteSecret, 'test_invite_secret')
  t.deepEqual(config.db, {
    cosmos_endpoint: 'test_cosmos_uri',
    cosmos_key: 'test_cosmos_key',
    cosmos_db_id: 'test_cosmos_id',
  })
  t.deepEqual(config.communicationService, {
    connectionString:
      'endpoint=https://test.communication.azure.com/;accesskey=mock-key-0000000000000000000000000000000000000000000000000000000000000000',
    emailDomainName: 'test.domain.com',
  })
})

test('config correctly loads allowedOrigins from environment', async t => {
  const config = (await import('#config')).default

  t.true(Array.isArray(config.allowedOrigins))
  t.true(config.allowedOrigins.every(origin => typeof origin === 'string'))
})
