import Joi from 'joi'

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

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required(),
})
