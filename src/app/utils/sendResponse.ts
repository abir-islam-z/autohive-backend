import { Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type ResponseType<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: TMeta;
};

/**
 * Send response to the client
 * @param res - Express Response object
 * @param data - Response data
 * @returns Response
 * @example
 * sendResponse(res, {
 *  success: true,
 * message: 'Created successfully',
 * statusCode: 201,
 * data: result,
 * });
 */

export const sendResponse = <T>(res: Response, data: ResponseType<T>) => {
  return res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    statusCode: data?.statusCode,
    data: data?.data,
    meta: data?.meta,
  });
};
