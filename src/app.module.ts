import { Module } from '@nestjs/common';
import { ConfigServerModule } from './components/config-server/config-server.module';
import { ConfigFileModule } from './components/config-file/config-file.module';
import { DirectoriesModule } from './components/directories/directories.module';

@Module({
  imports: [ConfigServerModule, ConfigFileModule, DirectoriesModule],
})
export class AppModule {}
