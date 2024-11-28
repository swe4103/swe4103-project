import { EmailClient } from '@azure/communication-email'

import config from '#config'

const emailClient = new EmailClient(config.communicationService.connectionString)

export const sendRegistrationEmail = async (userEmail, token, message) => {
  const frontPart =
    config.env === 'production' ? 'https://timeflow.swe4103.com' : 'http://localhost:5173'
  const registrationLink = `${frontPart}/register?token=${token}`
  const emailMessage = {
    senderAddress: config.communicationService.emailDomainName, // approved domain
    content: {
      subject: 'Register for Time Flow',
      plainText: `${message} ${registrationLink}`,
      html: `<p>${message}</p><a href="${registrationLink}">Time Flow Registration</a>`,
    },
    recipients: {
      to: [
        {
          address: userEmail,
        },
      ],
    },
  }
  const poller = await emailClient.beginSend(emailMessage)
  const response = await poller.pollUntilDone()
  console.log(`Email sent! Operation ID: ${response.messageId}`)
}

export const sendConfirmationEmail = async (userEmail, message) => {
  const emailMessage = {
    senderAddress: config.communicationService.emailDomainName, // approved domain
    content: {
      subject: 'Registration Success',
      plainText: `${message}`,
      html: `<p>${message}</p>`,
    },
    recipients: {
      to: [
        {
          address: userEmail,
          displayName: 'New User',
        },
      ],
    },
  }
  const poller = await emailClient.beginSend(emailMessage)
  const result = await poller.pollUntilDone()

  console.log(`Email sent! Operation ID: ${result.messageId}`)
}
