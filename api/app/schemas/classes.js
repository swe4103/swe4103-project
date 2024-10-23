import Joi from 'joi'

import Roles from '#constants/roles.js'

export const classSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
})

export const updateClassSchema = classSchema.fork(Object.keys(classSchema.describe().keys), field =>
  field.optional(),
)

export const listClassesQuerySchema = Joi.object({
  projectId: Joi.string().guid().optional().messages({
    'string.guid': 'projectId must be a valid GUID',
  }),
  teamId: Joi.string().guid().optional().messages({
    'string.guid': 'teamId must be a valid GUID',
  }),
})
  .or('projectId', 'teamId')
  .messages({
    'object.missing': 'At least one of projectId or teamId is required',
  })
