import { get } from 'env-var';
import 'dotenv/config';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  PATH_SWAGGER: get('PATH_SWAGGER').required().asString(),
  BASE_REPOS_PATH: get('BASE_REPOS_PATH').required().asString(),
  GITHUB_USERNAME: get('GITHUB_USERNAME').required().asString(),
  GITHUB_TOKEN: get('GITHUB_TOKEN').required().asString(),
};
