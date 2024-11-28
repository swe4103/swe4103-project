import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

const createEmailClientMock = () => {
  const mockPoller = {
    pollUntilDone: sinon.stub().resolves({ messageId: 'mock-id' }),
  }
  return {
    beginSend: sinon.stub().resolves(mockPoller),
  }
}

test('sendRegistrationEmail sends correct email in production environment', async t => {
  const emailClientMock = createEmailClientMock()

  // Create modified config for production
  const { config } = await setupTest('#services/emailService.js')
  config.env = 'production'

  const { service } = await setupTest('#services/emailService.js', {
    '@azure/communication-email': {
      EmailClient: function () {
        return emailClientMock
      },
    },
    '#config': config,
  })

  const testEmail = 'test@example.com'
  const testToken = 'test-token'
  const testMessage = 'Welcome to TimeFlow'

  await service.sendRegistrationEmail(testEmail, testToken, testMessage)

  const beginSendCall = emailClientMock.beginSend.firstCall.args[0]
  t.is(beginSendCall.senderAddress, config.communicationService.emailDomainName)
  t.is(beginSendCall.recipients.to[0].address, testEmail)
  t.is(beginSendCall.content.subject, 'Register for Time Flow')
  t.true(
    beginSendCall.content.html.includes('https://timeflow.swe4103.com/register?token=test-token'),
  )
  t.true(
    beginSendCall.content.plainText.includes(
      'https://timeflow.swe4103.com/register?token=test-token',
    ),
  )
})

test('sendRegistrationEmail sends correct email in development environment', async t => {
  const emailClientMock = createEmailClientMock()
  const { service, config } = await setupTest('#services/emailService.js', {
    '@azure/communication-email': {
      EmailClient: function () {
        return emailClientMock
      },
    },
  })

  const testEmail = 'test@example.com'
  const testToken = 'test-token'
  const testMessage = 'Welcome to TimeFlow'

  const originalEnv = config.env
  config.env = 'development'

  await service.sendRegistrationEmail(testEmail, testToken, testMessage)

  const beginSendCall = emailClientMock.beginSend.firstCall.args[0]
  t.true(beginSendCall.content.html.includes('http://localhost:5173/register?token=test-token'))
  t.true(
    beginSendCall.content.plainText.includes('http://localhost:5173/register?token=test-token'),
  )

  config.env = originalEnv
})

test('sendConfirmationEmail sends correct email', async t => {
  const emailClientMock = createEmailClientMock()
  const { service, config } = await setupTest('#services/emailService.js', {
    '@azure/communication-email': {
      EmailClient: function () {
        return emailClientMock
      },
    },
  })

  const testEmail = 'test@example.com'
  const testMessage = 'Registration successful!'

  await service.sendConfirmationEmail(testEmail, testMessage)

  const beginSendCall = emailClientMock.beginSend.firstCall.args[0]
  t.is(beginSendCall.senderAddress, config.communicationService.emailDomainName)
  t.is(beginSendCall.recipients.to[0].address, testEmail)
  t.is(beginSendCall.recipients.to[0].displayName, 'New User')
  t.is(beginSendCall.content.subject, 'Registration Success')
  t.true(beginSendCall.content.html.includes(testMessage))
  t.true(beginSendCall.content.plainText.includes(testMessage))
})

test('email sending handles errors', async t => {
  const mockError = new Error('Email sending failed')
  const mockPoller = {
    pollUntilDone: sinon.stub().rejects(mockError),
  }
  const emailClientMock = {
    beginSend: sinon.stub().resolves(mockPoller),
  }

  const { service } = await setupTest('#services/emailService.js', {
    '@azure/communication-email': {
      EmailClient: function () {
        return emailClientMock
      },
    },
  })

  await t.throwsAsync(
    async () => {
      await service.sendRegistrationEmail('test@example.com', 'token', 'message')
    },
    { message: 'Email sending failed' },
  )
})
