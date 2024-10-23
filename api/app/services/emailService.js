import config from '#config'

const { EmailClient } = require('@azure/communication-email')

const emailClient = new EmailClient(config.communicationService.connectionString)

async function sendRegistrationEmail(userEmail, registrationLink, className) {
  try {
    const emailMessage = {
      senderAddress: config.communicationService.emailDomainName, // approved domain
      content: {
        subject: 'Register for Flow Board',
        plainText: `You have been invited to join ${className} on Flow Board! Register using the following link: ${registrationLink}`,
        html: `<h1>Register for Flow Board</h1><p>You have been invited to join ${className} on Flow Board! Register using the following link:</p><a href="${registrationLink}">Flow Board Registration</a>`,
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

    const response = await emailClient.send(emailMessage)
    console.log(`Email sent! Operation ID: ${response.messageId}`)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = {
  sendRegistrationEmail,
}
