import { Module } from '@nestjs/common';
import { ConfigFileService } from './config-file.service';
import { ConfigFileController } from './config-file.controller';

@Module({
  providers: [ConfigFileService],
  controllers: [ConfigFileController],
})
export class ConfigFileModule {}
