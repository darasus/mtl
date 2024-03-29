import './trace';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as DDLogger } from './logger/logger.service';
import { PrismaService } from './prisma/prisma.service';
import { ddTracer } from './trace';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new DDLogger(),
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    })
  );

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.$use(async (params, next) => {
    return ddTracer.trace(`[Prisma][${params.model}:${params.action}]`, () => {
      return next(params);
    });
  });
  prismaService.enableShutdownHooks(app);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`
  );
}

bootstrap();
