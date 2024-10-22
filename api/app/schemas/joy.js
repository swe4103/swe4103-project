import Joi from 'joi'

export const joyRatingSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required().description('GUID (String) identifying the user'),
  teamId: Joi.string().required().description('GUID (String) identifying the team'),
  date: Joi.date().iso().required().description('Date-time in ISO format'),
  rating: Joi.number().integer().min(0).max(5).required().description('Integer rating from 0 to 5'),
})

export const updateJoyRatingSchema = joyRatingSchema.fork(
  Object.keys(joyRatingSchema.describe().keys),
  field => field.optional(),
)

export const joyRatingsQuerySchema = Joi.object({
  userId: Joi.string().optional().messages({
    'string.empty': 'userId cannot be empty',
  }),
  teamId: Joi.string().required().messages({
    'any.required': 'teamId is required',
    'string.empty': 'teamId cannot be empty',
  }),
  fromDate: Joi.date().iso().optional().messages({
    'date.format': 'fromDate must be in ISO format',
  }),
  toDate: Joi.date().iso().optional().messages({
    'date.format': 'toDate must be in ISO format',
  }),
})
