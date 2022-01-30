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
import { Auth0Controller } from '../auth0/auth0.controller';
import { ActivityActions } from '../redis/actions/ActivityActions';
import { PostActions } from '../redis/actions/PostActions';
import { FollowActions } from '../redis/actions/FollowActions';
import { LikeActions } from '../redis/actions/LikeActions';
import { TagActions } from '../redis/actions/TagActions';
import { UserActions } from '../redis/actions/UserActions';

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
    // redis actions
    ActivityActions,
    PostActions,
    FollowActions,
    LikeActions,
    TagActions,
    UserActions,
  ],
})
export class AppModule {}
