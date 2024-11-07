import Joi from 'joi'

export const teamSchema = Joi.object({
  name: Joi.string().required(),
  projectId: Joi.string().guid().required().description('GUID (String)'),
})

export const updateTeamSchema = teamSchema.fork(Object.keys(teamSchema.describe().keys), field =>
  field.optional(),
)

export const listTeamsQuerySchema = Joi.object({
  projectId: Joi.string().guid().required().messages({
    'string.guid': 'projectId must be a valid GUID',
    'any.required': 'projectId is required',
  }),
})
