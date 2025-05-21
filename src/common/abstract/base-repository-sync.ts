import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import simpleGit, { type SimpleGit } from 'simple-git';
import type { RepositoryManager } from '../repository-manager.config';
import type { IRepositorySync } from '../interfaces/repository-sync.interface';
import type { IRepositoryUrlBuilder } from '../builders/repository-builder.interface';

export class BaseRepositorySync implements IRepositorySync {
  protected readonly logger = new Logger(BaseRepositorySync.name);
  protected git: SimpleGit;

  constructor(
    protected readonly repository: RepositoryManager,
    protected readonly urlBuilder: IRepositoryUrlBuilder,
    protected readonly basePath: string,
  ) {
    this.ensureDirectory();
    this.git = simpleGit({ baseDir: this.getConfigPath() });
  }

  private ensureDirectory(): void {
    const dirPath = this.getConfigPath();
    if (!fs.existsSync(dirPath)) {
      this.logger.verbose(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  public getConfigPath(): string {
    return path.join(this.basePath, this.repository.repository);
  }

  public async sync(): Promise<void> {
    try {
      const isRepo = await this.isGitRepository();

      if (isRepo) {
        await this.pull();
      } else {
        await this.clone();
      }
    } catch (error: any) {
      this.logger.error(
        `Error syncing repository ${this.repository.name}: ${error.message}`,
      );
      throw error;
    }
  }

  private async isGitRepository(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  private async clone(): Promise<void> {
    this.validateRepository();
    this.logger.verbose(`Cloning repository: ${this.repository.repository}`);
    const repoUrl = await this.getRepositoryUrl();
    this.logger.debug(`Cloning from URL: ${this.maskSensitiveInfo(repoUrl)}`);

    const parentGit = simpleGit({ baseDir: this.basePath });
    await parentGit.clone(repoUrl, this.repository.repository);
  }

  protected getRepositoryUrl(): string {
    this.validateRepository();
    return this.urlBuilder
      .setAsPublic(false)
      .setCredentials(
        this.repository.auth?.username || '',
        this.repository.auth?.token || '',
      )
      .setHost(this.repository.host)
      .setOrganization(this.repository.organization)
      .setRepository(this.repository.repository)
      .build();
  }

  private maskSensitiveInfo(url: string): string {
    return url.replace(/\/\/.*?@/, '//***:***@');
  }

  protected validateRepository(): void {
    if (!this.repository.repository) {
      throw new Error('Repository name is required');
    }
    if (!this.repository.organization) {
      throw new Error('Organization name is required');
    }
    if (!this.repository.host) {
      throw new Error('Host is required');
    }
  }

  private async pull(): Promise<void> {
    this.logger.verbose(`Pulling repository: ${this.repository.repository}`);
    await this.git.pull('origin', this.repository.branch);
  }

  public async forceSync(): Promise<void> {
    try {
      const isRepo = await this.isGitRepository();

      if (isRepo) {
        await this.forcePull();
      } else {
        await this.clone();
      }
    } catch (error: any) {
      this.logger.error(
        `Error force syncing repository ${this.repository.name}: ${error.message}`,
      );
      throw error;
    }
  }

  private async forcePull(): Promise<void> {
    this.logger.verbose(`Force syncing repository: ${this.repository.name}`);
    await this.git
      .fetch(['--all', '--prune'])
      .reset(['--hard', `origin/${this.repository.branch}`])
      .pull('origin', this.repository.branch);
  }
}
