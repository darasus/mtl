import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { ActivityController } from '../activity/activity.controller';
import { PusherService } from '../pusher/pusher.service';
import { CacheKeyService } from '../cache/cacheKey.service';
import { CacheService } from '../cache/cache.service';
import { Auth0Controller } from '../auth0/auth0.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    UserController,
    FeedController,
    CommentController,
    PostController,
    ScreenshotController,
    TagController,
    ActivityController,
    Auth0Controller,
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
    ActivityService,
    PusherService,
    CacheKeyService,
    CacheService,
  ],
})
export class AppModule {}
