import { Module } from '@nestjs/common';
import { ConfigServerService } from './config-server.service';
import { ConfigServerController } from './confi-server.controller';

@Module({
  providers: [ConfigServerService],
  controllers: [ConfigServerController],
})
export class ConfigServerModule {}
