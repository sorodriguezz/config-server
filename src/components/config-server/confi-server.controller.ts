import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigServerService } from './config-server.service';

@Controller()
@ApiTags('Config Server')
export class ConfigServerController {
  constructor(private readonly configServerService: ConfigServerService) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sincronizar repositorios' })
  @ApiResponse({ status: 200, description: 'Repositorios sincronizados exitosamente' })
  async forceSync() {
    await this.configServerService.forceSyncRepositories();
    return { message: 'Repositories synchronized successfully' };
  }
}
