import { envs } from '../config/envs.config';
import { RepositoryType } from './factories/repository-builder.factory';

export interface RepositoryManager {
  name: RepositoryType;
  host: string;
  protocol: string;
  organization: string;
  repository: string;
  branch: string;
  auth?: {
    username: string;
    token: string;
  };
}

export class RepositoryManagerConfig {
  public static readonly repositoryManager: RepositoryManager[] = [
    {
      name: RepositoryType.GITHUB,
      host: 'github.com',
      protocol: 'https',
      organization: 'sorodriguezz',
      repository: 'testjson',
      branch: 'main',
      auth: {
        username: envs.GITHUB_USERNAME,
        token: envs.GITHUB_TOKEN,
      },
    },
    {
      name: RepositoryType.GITHUB,
      host: 'github.com',
      protocol: 'https',
      organization: 'sorodriguezz',
      repository: 'test123',
      branch: 'main',
    },
  ];
}
