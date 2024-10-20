import config from '#config'
import Roles from '#constants/roles.js'
import usersSchema from '#schemas/users.js'
import { inviteUsers } from '#services/userService.js'

export const invite = async (req, res) => {
  const { error } = usersSchema.invite.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    await inviteUsers(req.body)
    return res.status(200).json({ message: `${req.body.role} invitations sent successfully.` })
  } catch (error) {
    console.error('Error sending invites:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
