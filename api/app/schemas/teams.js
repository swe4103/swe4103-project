import Joi from 'joi'

export const teamSchema = Joi.object({
  name: Joi.string().required(),
  projectId: Joi.string().guid().required().description('GUID (String)'),
})

export const updateTeamSchema = teamSchema.fork(Object.keys(teamSchema.describe().keys), field =>
  field.optional(),
)
