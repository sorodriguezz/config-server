import { get } from 'env-var';
import 'dotenv/config';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  GITHUB_USERNAME: get('GITHUB_USERNAME').required().asString(),
  GITHUB_TOKEN: get('GITHUB_TOKEN').required().asString(),
};
