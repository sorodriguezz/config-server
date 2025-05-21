import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ConfigFileService } from './config-file.service';

import { globSync } from 'fs';
import * as path from 'path';
import type { ConfigQueryDto } from './dto/config-query.dto';

@Controller()
export class ConfigFileController {
  private readonly logger = new Logger(ConfigFileController.name);

  constructor(private readonly configFileService: ConfigFileService) {}

  @Get()
  async getConfig(@Query() query: ConfigQueryDto) {
    const { repo, application, profile } = query;

    if (!repo || !application || !profile) {
      this.logger.error('Missing required parameters');
      return {
        error: 'Missing required parameters',
      };
    }

    this.logger.debug(
      `Fetching config for repo: ${repo}, application: ${application}, profile: ${profile}`,
    );

    const filePattern = `${application}-${profile}.*`;
    const repositoryPath = path.join(__dirname, '../..', `repos/${repo}`);

    const files = globSync(path.join(repositoryPath, filePattern));

    if (files.length === 0) {
      this.logger.warn(
        `No config file found for ${application}-${profile} in repo ${repo}`,
      );
      return {};
    }

    const filePath = files[0] || '';

    const fileName = path.basename(filePath);

    const config = await this.configFileService.readConfigFile(
      repositoryPath,
      fileName,
    );
    return config.content;
  }
}
