import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ConfigFileService } from './config-file.service';

import { globSync } from 'glob';
import { basename, join, resolve, sep } from 'node:path';
import type { ConfigQueryDto } from './dto/config-query.dto';
import { BASE_REPOS_PATH } from '../../config/constants.config';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Get File')
export class ConfigFileController {
  private readonly logger = new Logger(ConfigFileController.name);

  constructor(private readonly configFileService: ConfigFileService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener configuración' })
  @ApiQuery({ name: 'repo', description: 'Nombre del repositorio', required: true })
  @ApiQuery({ name: 'application', description: 'Nombre de la aplicación', required: true })
  @ApiQuery({ name: 'profile', description: 'Perfil de configuración', required: true })
  @ApiResponse({ status: 200, description: 'Configuración obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
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

    const repositoryPath = resolve(BASE_REPOS_PATH, repo);
    const pattern = join(repositoryPath, `${application}-${profile}.*`)
      .split(sep)
      .join('/');

    const matchedFiles = globSync(pattern, { nodir: true });
    const filePath = matchedFiles[0];

    if (!filePath) {
      this.logger.warn(
        `No config file found for ${application}-${profile} in repo ${repo}`,
      );
      return {};
    }

    const fileName = basename(filePath);

    const config = await this.configFileService.readConfigFile(
      repositoryPath,
      fileName,
    );
    return config.content;
  }
}
