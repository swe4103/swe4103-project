import Joi from 'Joi'

export const projectSchema = Joi.object({
  name: Joi.string().required(),
  classId: Joi.string().guid().required().description('GUID (String)'),
})

export const updateProjectSchema = projectSchema.fork(
  Object.keys(projectSchema.describe().keys),
  field => field.optional(),
)

export const listProjectsQuerySchema = Joi.object({
  classId: Joi.string().guid().required().messages({
    'string.guid': 'classId must be a valid GUID',
    'any.required': 'classId is required',
  }),
})
