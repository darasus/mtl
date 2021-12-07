import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { FollowService } from '../follow/follow.service';
import { ActivityService } from '../activity/activity.service';
import { FeedController } from '../feed/feed.controller';
import { FeedService } from '../feed/feed.service';
import { CommentController } from '../comment/comment.controller';
import { PostController } from '../post/post.controller';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { LikeService } from '../like/like.service';
import { ScreenshotController } from '../screenshot/screenshot.controller';
import { TagController } from '../tag/tag.controller';
import { TagService } from '../tag/tag.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CacheModule.register(), AuthModule],
  controllers: [
    AppController,
    UserController,
    FeedController,
    CommentController,
    PostController,
    ScreenshotController,
    TagController,
  ],
  providers: [
    AppService,
    UserService,
    PrismaService,
    FollowService,
    ActivityService,
    FeedService,
    PostService,
    CommentService,
    LikeService,
    TagService,
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
