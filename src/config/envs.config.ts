import { get } from 'env-var';
import 'dotenv/config';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  BASE_REPOS_PATH: get('BASE_REPOS_PATH').required().asString(),
  GITHUB_USERNAME: get('GITHUB_USERNAME').required().asString(),
  GITHUB_TOKEN: get('GITHUB_TOKEN').required().asString(),
};
