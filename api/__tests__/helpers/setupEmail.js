import sinon from 'sinon'

export const createEmailStubs = () => ({
  sendRegistrationEmail: sinon.stub().resolves(),
  sendConfirmationEmail: sinon.stub().resolves(),
})
