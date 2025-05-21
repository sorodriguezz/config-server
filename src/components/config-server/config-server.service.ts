import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { RepositoryBuilderFactory } from '../../common/factories/repository-builder.factory';
import { RepositorySyncFactory } from '../../common/factories/repository-sync.factory';
import type { IRepositoryConfig } from '../../common/interfaces/repository-config.interface';
import type { IRepositorySync } from '../../common/interfaces/repository-sync.interface';
import { RepositoryManagerConfig } from '../../common/repository-manager.config';

const BASE_REPOS_PATH = path.join(__dirname, '../..', 'repos');

@Injectable()
export class ConfigServerService implements OnModuleInit, IRepositoryConfig {
  private readonly logger = new Logger(ConfigServerService.name);
  private readonly repositories: IRepositorySync[];

  constructor() {
    const repositoryFactory = new RepositorySyncFactory(
      RepositoryManagerConfig.repositoryManager,
      new RepositoryBuilderFactory(),
      BASE_REPOS_PATH,
    );
    this.repositories = repositoryFactory.createSyncers();
  }

  async onModuleInit() {
    await this.syncAllRepositories();
  }

  public async syncAllRepositories(): Promise<void> {
    this.logger.log('Starting repository synchronization...');
    await Promise.all(this.repositories.map((repo) => repo.sync()));
    this.logger.log('Repository synchronization completed');
  }

  public async forceSyncRepositories(): Promise<void> {
    this.logger.log('Starting force sync of all repositories...');
    await Promise.all(this.repositories.map((repo) => repo.forceSync()));
    this.logger.log('Force sync completed');
  }

  public getConfig(application: string, profile: string): any {
    const filename = `${application}.${profile}.json`;

    for (const repository of this.repositories) {
      const filePath = path.join(repository.getConfigPath(), filename);

      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    }

    throw new Error(
      `Configuration not found for ${application} with profile ${profile}`,
    );
  }
}
