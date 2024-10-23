import Joi from 'Joi'

export const projectSchema = Joi.object({
  id: Joi.string().guid().required().description('GUID (String)'),
  name: Joi.string().required(),
  classId: Joi.string().guid().required().description('GUID (String)'),
})

export const updateProjectSchema = projectSchema.fork(
  Object.keys(projectSchema.describe().keys),
  field => field.optional(),
)
