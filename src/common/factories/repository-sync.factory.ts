import type { RepositoryManager } from '../repository-manager.config';
import type { RepositoryBuilderFactory } from './repository-builder.factory';
import { BaseRepositorySync } from '../abstract/base-repository-sync';
import type { IRepositorySync } from '../interfaces/repository-sync.interface';

export class RepositorySyncFactory {
  constructor(
    private readonly repositories: RepositoryManager[],
    private readonly builderFactory: RepositoryBuilderFactory,
    private readonly basePath: string,
  ) {}

  createSyncers(): IRepositorySync[] {
    return this.repositories.map((repo: RepositoryManager) => {
      const urlBuilder = this.builderFactory.getBuilder(repo.name);
      return new (class extends BaseRepositorySync {
        protected getRepositoryUrl(): string {
          const url = this.urlBuilder
            .setHost(repo.host)
            .setProtocol(repo.protocol)
            .setOrganization(repo.organization)
            .setRepository(repo.repository);

          if (repo.auth) {
            url.setAsPublic(false);
            url.setCredentials(repo.auth.username, repo.auth.token);
          } else {
            url.setAsPublic(true);
          }

          return url.build();
        }
      })(repo, urlBuilder, this.basePath);
    });
  }
}
