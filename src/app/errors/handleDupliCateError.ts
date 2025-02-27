import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import { MongoDuplicateKeyError } from './../interface/error';

const handleDuplicateError = (
  err: MongoDuplicateKeyError,
): TGenericErrorResponse => {
  const path = Object.keys(err.keyPattern)[0];
  const message = `${err.keyValue[path]} is already taken`;

  const errorSources: TErrorSources = [
    {
      path,
      message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `Invalid ${path}`,
    errorSources,
  };
};

export default handleDuplicateError;
