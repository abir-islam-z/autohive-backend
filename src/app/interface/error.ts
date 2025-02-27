export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};

export type MongoDuplicateKeyError = {
  code: number; // The error code, typically 11000 for duplicate key errors
  keyPattern: Record<string, 1 | -1>; // Key pattern indicating the field(s) causing the conflict
  keyValue: Record<string, unknown>; // The actual value(s) of the conflicting field(s)
  errmsg: string; // The detailed error message
  name: string; // Error name, usually 'MongoError'
  message: string; // The error message
};
