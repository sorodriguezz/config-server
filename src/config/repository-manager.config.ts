import { RepositoryType } from '../common/factories/repository-builder.factory';
import type { RepositoryManager } from './interfaces/repository-manager.interface';

export class RepositoryManagerConfig {
  public static readonly repositoryManager: RepositoryManager[] = [
    {
      name: RepositoryType.GITHUB,
      host: 'github.com',
      protocol: 'https',
      organization: 'sorodriguezz',
      repository: 'service-configuration-sb',
      branch: 'master',
    },
  ];
}
