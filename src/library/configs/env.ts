import dotenv from 'dotenv'
import path from 'path'

import pkg from '../../../package.json'
import { getOsEnvOptional, getOsEnv, normalizePort, toBool, toNumber } from './os'

/**
 * Load .env file or for tests the .env.test, .env.production file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) })

/**
 * Environment variables
 */

const env = {
 node: process.env.NODE_ENV || 'development',
 isProduction: process.env.NODE_ENV === 'production',
 isTest: process.env.NODE_ENV === 'test',
 isDevelopment: process.env.NODE_ENV === 'development',
 app: {
  name: getOsEnv('APP_NAME'),
  version: pkg.version,
  description: pkg.description,
  host: getOsEnv('APP_HOST'),
  schema: getOsEnv('APP_SCHEMA'),
  routePrefix: getOsEnv('APP_ROUTE_PREFIX') || '',
  port: normalizePort(process.env.PORT || getOsEnv('APP_PORT') || '9090'),
  banner: toBool(getOsEnv('APP_BANNER') || 'true'),
 },
 database: {
  connection: getOsEnv('DB_CONNECTION'),
 },
 log: {
  level: getOsEnv('LOG_LEVEL'),
  json: toBool(getOsEnvOptional('LOG_JSON') || 'true'),
  output: getOsEnv('LOG_OUTPUT'),
 },
 monitor: {
  enabled: toBool(getOsEnv('MONITOR_ENABLED') || 'true'),
  route: getOsEnv('MONITOR_ROUTE'),
  username: getOsEnv('MONITOR_USERNAME'),
  password: getOsEnv('MONITOR_PASSWORD'),
 },
 passport: {
  jwtToken: getOsEnv('PASSPORT_JWT'),
  jwtAccessExpired: toNumber(getOsEnv('PASSPORT_JWT_ACCESS_EXPIRED') || '90000'),
  jwtRefreshExpired: toNumber(getOsEnv('PASSPORT_JWT_REFRESH_EXPIRED') || '259200'),
 },
 swagger: {
  enabled: toBool(getOsEnv('SWAGGER_ENABLED') || 'true'),
  route: getOsEnv('SWAGGER_ROUTE') || '/swagger',
  username: getOsEnv('SWAGGER_USERNAME') || 'admin',
  password: getOsEnv('SWAGGER_PASSWORD') || '1234',
 },
 pageLimit: toNumber(getOsEnv('PAGE_LIMIT') || '10'),
 aws: {
  idKey: getOsEnv('AWS_ID_KEY'),
  secretKey: getOsEnv('AWS_SECRET_KEY'),
  bucketName: getOsEnv('AWS_BUCKET'),
 }

}

export default env