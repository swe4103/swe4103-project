import Joi from 'joi'

import Roles from '#constants/roles.js'

const passwordSchema = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$'))
  .required()
  .messages({
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    'string.empty': 'Password cannot be empty.',
    'string.min': 'Password should be at least 8 characters long.',
    'string.max': 'Password should not exceed 30 characters.',
  })

export const userSchema = Joi.object({
  password: passwordSchema,
  displayName: Joi.string(),
  email: Joi.string().email(),
  role: Joi.string().valid(Roles.ADMIN, Roles.STUDENT, Roles.INSTRUCTOR),
  groups: Joi.array().items(Joi.string().guid()).default([]),
})

export const updateUserSchema = userSchema.fork(Object.keys(userSchema.describe().keys), field =>
  field.optional(),
)

export const inviteSchema = Joi.object({
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
})

export const registerSchema = Joi.object({
  displayName: Joi.string(),
  password: passwordSchema,
})
