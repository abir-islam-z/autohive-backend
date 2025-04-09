import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

type ValidatePart = 'body' | 'query' | 'cookies' | 'params';

const validateRequest = (
  schema: AnyZodObject,
  validatePart: ValidatePart[] = ['body'],
) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      for (const key of validatePart) {
        if (!req[key]) {
          continue;
        }

        const data = await schema.parseAsync(req[key]);

        req[key] = data;
      }

      next();
    },
  );
};

export default validateRequest;
