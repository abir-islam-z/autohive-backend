import { JsonWebTokenError } from 'jsonwebtoken';
import { TErrorSources } from '../interface/error';

const handleAuthenticationError = (err: JsonWebTokenError) => {
  let statusCode = 401;
  let message = 'Invalid token';

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const errorSources: TErrorSources = [
    {
      path: '',
      message,
    },
  ];

  return {
    statusCode,
    message: 'Invalid token',
    errorSources,
  };
};

export default handleAuthenticationError;
