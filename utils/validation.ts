import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
    .required(),
  
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .message('Password must be at least 8 characters, include uppercase, lowercase, number, and special character')
    .required(),
  
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50)
});

export const taskCreationSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required(),
  
  description: Joi.string().max(1000),
  
  project: Joi.string().required(), // MongoDB ObjectId
  
  priority: Joi.number()
    .valid(1, 2, 3, 4)
    .optional(),
  
  dueDate: Joi.date().iso().optional(),
  
  labels: Joi.array().items(Joi.string()).optional() // Array of label ObjectIds
});

export function validateInput(data: any, schema: Joi.ObjectSchema) {
  const { error } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
}