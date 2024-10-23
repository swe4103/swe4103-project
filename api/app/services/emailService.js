import config from '#config'

const { EmailClient } = require('@azure/communication-email')

const emailClient = new EmailClient(config.communicationService.connectionString)

export const sendRegistrationEmail = async (userEmail, registrationLink, className) => {
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

export const sendConfirmationEmail = async (userEmail, className) => {
  try {
    const emailMessage = {
      senderAddress: config.communicationService.emailDomainName, // approved domain
      content: {
        subject: 'Registration Success',
        plainText: `You have successfully registered for ${className} on Flow Board!`,
        html: `<p>You have successfully registered for ${className} on Flow Board!</p>`,
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
