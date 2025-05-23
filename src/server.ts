import { AbstractHttpAdapter, NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './config/envs.config';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface Options {
  port: number;
  httpFramework?: AbstractHttpAdapter;
}

export class Server {
  private readonly logger = new Logger(Server.name);
  private readonly port: number;
  private readonly httpFramework: AbstractHttpAdapter;

  constructor(private readonly options: Options) {
    const { port = 8888, httpFramework = new FastifyAdapter() } = options;

    this.port = port;
    this.httpFramework = httpFramework;
  }

  async start() {
    const dbDir = join(process.cwd(), 'data');
    if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

    const app = await NestFactory.create(AppModule, this.httpFramework);

    const config = new DocumentBuilder()
      .setTitle('Config Server API')
      .setDescription('API para gestionar configuraciones centralizadas')
      .setVersion('1.0')
      .addBasicAuth(
        {
          type: 'http',
          scheme: 'basic',
          description: 'Ingrese sus credenciales',
          name: 'basic',
        },
        'basic',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(envs.PATH_SWAGGER, app, document);

    await app.listen(this.port, '0.0.0.0', () => {
      this.logger.log(`Server is running on port ${this.port}`);
    });
  }
}
