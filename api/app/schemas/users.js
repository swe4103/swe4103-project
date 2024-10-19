import Joi from 'joi'

import { Roles } from '#constants/roles.js'

export default {
  invite: Joi.object({
    emails: Joi.array().items(Joi.string().email()).min(1).required().messages({
      'array.min': 'Emails are required and must be a non-empty array.',
      'string.email': 'Each email must be a valid email address.',
    }),
    role: Joi.string().valid(Roles.INSTRUCTOR, Roles.STUDENT).required().messages({
      'any.only': 'Invalid invite type. Must be either STUDENT or INSTRUCTOR.',
    }),
    teamId: Joi.when('role', {
      is: Roles.STUDENT,
      then: Joi.string().required().messages({
        'any.required': 'Team ID is required for student invitations.',
      }),
      otherwise: Joi.optional(),
    }),
  }),
}
