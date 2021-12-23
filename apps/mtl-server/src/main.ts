import './trace';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // new FastifyAdapter({ logger: process.env.NODE_ENV === 'development' })
    new FastifyAdapter()
  );
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    })
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`
  );
}

bootstrap();
