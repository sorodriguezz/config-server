import { AbstractHttpAdapter, NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

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
    const app = await NestFactory.create(AppModule, this.httpFramework);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.listen(this.port, () => {
      this.logger.log(`Server is running on port ${this.port}`);
    });
  }
}
