import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './components/auth/auth.module';
import { ConfigFileModule } from './components/config-file/config-file.module';
import { ConfigServerModule } from './components/config-server/config-server.module';
import { DirectoriesModule } from './components/directories/directories.module';

import { join } from 'path';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { envs } from './config/envs.config';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(envs.THROTTLER_TTL),
          limit: envs.THROTTLER_LIMIT,
        },
      ],
    }),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
