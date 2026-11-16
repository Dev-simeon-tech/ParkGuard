import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationException } from '@/common/exceptions';
import type { ErrorFieldData } from '@/common/exceptions';

type ValidationSchemas = {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
};

export function validationMiddleware(schemas: ValidationSchemas) {
  const schema = z.object(schemas);

  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      if (parsed.params) {
        req.params = parsed.params as Request['params'];
      }
      if (parsed.query) {
        Object.defineProperty(req, 'query', {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const invalidData: ErrorFieldData = error.issues.map((issue) => ({
          [String(issue.path[1] ?? issue.path[0])]: issue.message,
        }));
        const invalidFields = invalidData.map((entry) => Object.keys(entry)[0]).join(', ');
        next(new ValidationException(`Invalid input for: ${invalidFields}`, invalidData));
        return;
      }
      next(error);
    }
  };
}
