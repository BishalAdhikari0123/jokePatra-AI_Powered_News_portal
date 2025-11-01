import Joi from 'joi';

export const generatePromptSchema = Joi.object({
  prompt: Joi.string().min(10).max(2000).required(),
  publish: Joi.boolean().default(false),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const articleSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required(),
  summary: Joi.string().max(500).optional(),
  content: Joi.string().min(20).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  language: Joi.string().valid('en', 'ne').default('en'),
  publishedAt: Joi.date().optional(),
});

export function validateRequest<T>(
  schema: Joi.ObjectSchema,
  data: any
): { error?: string; value?: T } {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return { error: error.details.map((d) => d.message).join(', ') };
  }
  return { value };
}
