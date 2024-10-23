import Joi from 'joi'

import Roles from '#constants/roles.js'

export const classSchema = Joi.object({
  id: Joi.string().guid().required().description('GUID (String)'),
  name: Joi.string().required(),
  year: Joi.number().required(),
})

export const updateClassSchema = classSchema.fork(Object.keys(classSchema.describe().keys), field =>
  field.optional(),
)
