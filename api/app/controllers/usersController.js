import config from '#config'
import { Roles } from '#constants/roles.js'
import usersSchema from '#schemas/users.js'

export default {
  invite: async (req, res) => {
    // step 1: validate request body
    const { error } = usersSchema.invite.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    // step 2: validate request authorization
    const { emails, role, projectId } = req.body
    const inviterRole = req.user.role
    if (
      inviterRole === Roles.STUDENT ||
      (role === Roles.INSTRUCTOR && inviterRole !== Roles.ADMIN)
    ) {
      return res.status(403).json({ message: 'You are not authorized to send this invite' })
    }

    try {
      // step 3: generate tokens and send emails
      const invitations = emails.map(email => {
        const tokenPayload = { email, role }
        if (role === Roles.STUDENT) {
          tokenPayload.projectId = projectId
        }
        const token = jwt.sign(tokenPayload, config.jwtInviteSecret, { expiresIn: '3d' })
        // TODO update project in DB with email and status, and token
        // TODO return Promise.all([sendInviteEmail(email, role, token)])
        return null
      })

      await Promise.all(invitations)
      return res.status(200).json({ message: `${role} invitations sent successfully.` })
    } catch (error) {
      console.error('Error sending invites:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
  acceptInvite: async (req, res) => {
    const invitee = req.invitee
    try {
      // TODO update db project participant status and remove token, blacklist token
    } catch (error) {
      console.error('Error accepting invite:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  },
}
