import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ConfigServerService } from './config-server.service';

@Controller('config')
export class ConfigServerController {
  constructor(private readonly configServerService: ConfigServerService) {}

  @Post('sync')
  async forceSync() {
    await this.configServerService.forceSyncRepositories();
    return { message: 'Repositories synchronized successfully' };
  }
}
