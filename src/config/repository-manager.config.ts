import { RepositoryType } from '../common/factories/repository-builder.factory';
import { envs } from './envs.config';
import type { RepositoryManager } from './interfaces/repository-manager.interface';

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
