import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 1337,
  db_url: process.env.DB_URL || '',
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  NODE_ENV: process.env.NODE_ENV,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  sp: {
    endpoint: process.env.SP_ENDPOINT,
    username: process.env.SP_USERNAME,
    password: process.env.SP_PASSWORD,
    prefix: process.env.SP_PREFIX,
    return_url: process.env.SP_RETURN_URL,
  },
};

export default config;
