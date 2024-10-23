import Joi from 'joi'

export const teamSchema = Joi.object({
  id: Joi.string().guid().required().description('GUID (String)'),
  name: Joi.string().required(),
  projectId: Joi.string().guid().required().description('GUID (String)'),
})

export const updateTeamSchema = teamSchema.fork(Object.keys(teamSchema.describe().keys), field =>
  field.optional(),
)
