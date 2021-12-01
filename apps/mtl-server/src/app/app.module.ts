import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
