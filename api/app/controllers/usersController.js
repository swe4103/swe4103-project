import config from '#config'
import { Roles } from '#constants/roles.js'
import usersSchema from '#schemas/users.js'
import { generateUserInvites } from '#services/userService.js'

export const invite = async (req, res) => {
  // step 1: validate request body
  const { error } = usersSchema.invite.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  // step 2: validate request authorization
  const inviterRole = req.user.role
  const inviteeRole = req.body.role
  if (
    inviterRole === Roles.STUDENT ||
    (inviteeRole === Roles.INSTRUCTOR && inviterRole !== Roles.ADMIN)
  ) {
    return res.status(403).json({ message: 'You are not authorized to send this invite' })
  }

  try {
    // step 3: generate tokens and send emails
    await generateUserInvites(req.body)
    return res.status(200).json({ message: `${inviteeRole} invitations sent successfully.` })
  } catch (error) {
    console.error('Error sending invites:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
