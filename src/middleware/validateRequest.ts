import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

interface ValidationSchemas {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}

export const validateRequest = (schemas: ValidationSchemas) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const partsToValidate: [keyof ValidationSchemas, any][] = [
    ['body', req.body],
    ['query', req.query],
    ['params', req.params],
  ];

  for (const [key, value] of partsToValidate) {
    if (schemas[key]) {
      const { error } = schemas[key]!.validate(value, { abortEarly: false });
      if (error) {
        const messages = error.details.map((d) => d.message).join(', ');
        return res.status(400).json({ success: false, message: messages });
      }
    }
  }

  next();
};
