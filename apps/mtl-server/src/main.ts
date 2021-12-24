import './trace';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyRequest, FastifyReply } from 'fastify';

import { AppModule } from './app/app.module';
import { Logger as DDLogger } from './logger/logger.service';

const logger = new DDLogger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    {
      logger: new DDLogger(),
    }
    // new FastifyAdapter({
    //   logger: {
    //     prettyPrint: true,
    //     serializers: {
    //       res(reply: FastifyReply) {
    //         // The default
    //         return {
    //           statusCode: reply.statusCode,
    //         };
    //       },
    //       req(request: FastifyRequest) {
    //         return {
    //           method: request.method,
    //           url: request.url,
    //           path: request.routerPath,
    //           parameters: request.params,
    //           // Including the headers in the log could be in violation
    //           // of privacy laws, e.g. GDPR. You should use the "redact" option to
    //           // remove sensitive fields. It could also leak authentication data in
    //           // the logs.
    //           headers: request.headers,
    //         };
    //       },
    //     },
    //   },
    // })
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
