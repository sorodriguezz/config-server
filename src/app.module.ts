import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './components/auth/auth.module';
import { ConfigFileModule } from './components/config-file/config-file.module';
import { ConfigServerModule } from './components/config-server/config-server.module';
import { DirectoriesModule } from './components/directories/directories.module';

import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'data', 'database.sqlite'),
      entities: [join(__dirname, '**', '*.entity.{js,ts}')],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigServerModule,
    ConfigFileModule,
    DirectoriesModule,
    AuthModule,
  ],
})
export class AppModule {}
