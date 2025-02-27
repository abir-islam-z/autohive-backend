import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

type Placeholder = 'body' | 'query' | 'cookies' | 'params' | 'file';

const validateRequest = (
  schema: AnyZodObject,
  placeholder: Placeholder[] = ['body'],
) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      for (const key of placeholder) {
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
