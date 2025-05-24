import { get } from 'env-var';
import 'dotenv/config';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  PATH_SWAGGER: get('PATH_SWAGGER').required().asString(),
  BASIC_AUTH_USERNAME: get('BASIC_AUTH_USERNAME').required().asString(),
  BASIC_AUTH_PASSWORD: get('BASIC_AUTH_PASSWORD').required().asString(),
  BASE_REPOS_PATH: get('BASE_REPOS_PATH').required().asString(),
  THROTTLER_TTL: get('THROTTLER_TTL').required().asInt(),
  THROTTLER_LIMIT: get('THROTTLER_LIMIT').required().asInt(),
};
