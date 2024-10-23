import Joi from 'joi'

export const tenPointSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().required().description('GUID (String) identifying the user'),
  teamId: Joi.string().required().description('GUID (String) identifying the team'),
  date: Joi.date().iso().required().description('Date-time in ISO format'),
  ratings: Joi.object()
    .pattern(Joi.string(), Joi.number().integer())
    .required()
    .description('Dictionary of user IDs as keys and integer ratings as values'),
})

export const updateTenPointSchema = tenPointSchema.fork(
  Object.keys(tenPointSchema.describe().keys),
  field => field.optional(),
)

export const tenPointQuerySchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'userId is required',
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
