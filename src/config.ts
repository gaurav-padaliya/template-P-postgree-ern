// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TZ;

export const db = {
  production: {
    // DB_HOST: 'database-2.cwl9pnlwil0n.ap-south-1.rds.amazonaws.com',
    // DB_USERNAME: 'postgres',
    // DB_PASSWORD: 'password',
    // DB_DATABASE: '',
    // DB_PORT: 5432,
  },
  dev: {
    DB_HOST: '127.0.0.1',
    DB_USERNAME: 'postgres',
    DB_PASSWORD: '1231',
    DB_DATABASE: 'MicroService',
    DB_PORT: 5432,
  },
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};

export const logDirectory = process.env.LOG_DIR;

export const redis = {
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '0'),
  password: process.env.REDIS_PASSWORD || '',
};

export const caching = {
  contentCacheDuration: parseInt(
    process.env.CONTENT_CACHE_DURATION_MILLIS || '600000',
  ),
};
