import { envs } from '../../config/envs.config';
import { AzureUrlBuilder } from '../builders/azure-url.builder';
import { GitHubUrlBuilder } from '../builders/github-url-builder';
import { GitLabUrlBuilder } from '../builders/gitlab-url.builder';
import type { IRepositoryUrlBuilder } from '../builders/repository-builder.interface';
import type { RepositoryManager } from '../../config/repository-manager.config';

export enum RepositoryType {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  AZURE = 'azure',
}

export class RepositoryBuilderFactory {
  getPathRepository(repository: RepositoryManager): string {
    const urlBuilder = this.getBuilder(repository.name);

    const url = urlBuilder
      .setProtocol(repository.protocol)
      .setHost(repository.host)
      .setOrganization(repository.organization)
      .setRepository(repository.repository);

    if (repository.auth) {
      url.setAsPublic(false);
      url.setCredentials(envs.GITHUB_USERNAME, envs.GITHUB_TOKEN);
    } else {
      url.setAsPublic(true);
    }

    return url.build();
  }

  public getBuilder(type: RepositoryType): IRepositoryUrlBuilder {
    const builders: any = {
      [RepositoryType.GITHUB]: GitHubUrlBuilder,
      [RepositoryType.GITLAB]: GitLabUrlBuilder,
      [RepositoryType.AZURE]: AzureUrlBuilder,
    };
    const Builder = builders[type];

    if (!Builder) {
      throw new Error(`No builder found for repository type: ${type}`);
    }

    return new Builder();
  }
}
