import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from '../activity/activity.service';
import { FollowService } from '../follow/follow.service';
import { OptionalUserGuard } from '../guards/OptionalUserGuard';
import { PrismaService } from '../prisma/prisma.service';
import { Route } from '@mtl/types';
import axios from 'axios';
import { Response, Request } from 'express';

import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@mtl/api-types';
import { getMyIdByReq } from '../utils/getMyIdByReq';
import { Logger } from '../logger/logger.service';
import { processErrorResponse, years } from '@mtl/utils';
import { UserActions } from '../redis/actions/UserActions';
import { PostActions } from '../redis/actions/PostActions';

export class UpdateUserDto {
  newNickname: string;
  email: string;
  name: string;
  password: string;
  image: string;
}

@Controller()
export class UserController {
  private readonly logger = new Logger();
  private readonly userActions = new UserActions();
  private readonly postActions = new PostActions();

  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
    private readonly activityService: ActivityService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  @Get(Route.User)
  async getUserById(
    @Param('nickname') nickname: string
  ): Promise<ApiResponse[Route.User]> {
    return this.userActions.getUserByNickname({ nickname });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(Route.UserActivity)
  async getUserActivity(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('nickname') nickname: string,
    @Query('take') take: string,
    @Query('cursor') cursor: string
  ): Promise<ApiResponse[Route.UserActivity]> {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    if (myId !== user?.id) {
      res.status(403);
      return null;
    }

    res.status(HttpStatus.OK).send([]);
    // return this.userService.getUserActivity({
    //   userId: myId,
    //   take: Number(take) || undefined,
    //   cursor,
    // });
  }

  @Get(Route.UserFollowCount)
  async getFollowerCount(
    @Param('nickname') nickname: string
  ): Promise<ApiResponse[Route.UserFollowCount]> {
    const user = await this.userService.getUserByNickname({ nickname });
    return this.userService.getUserFollowerCount({ userId: user?.id });
  }

  @Get(Route.UserFollowingsCount)
  async getFollowingCount(
    @Param('nickname') nickname: string
  ): Promise<ApiResponse[Route.UserFollowingsCount]> {
    const user = await this.userService.getUserByNickname({ nickname });
    return this.userService.getUserFollowingsCount({ userId: user?.id });
  }

  @UseGuards(OptionalUserGuard)
  @Get(Route.DoIFillowUser)
  async doIFollow(
    @Req() req: Request,
    @Param('nickname') nickname: string
  ): Promise<ApiResponse[Route.DoIFillowUser]> {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    if (!myId) return { doIFollow: false };

    return this.followService.doIFollow({
      followerUserId: myId,
      followingUserId: user?.id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:nickname/follow')
  async follow(@Req() req: Request, @Param('nickname') nickname: string) {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    const response = await this.followService.followUser({
      followingUserId: user?.id,
      followerUserId: myId,
    });

    await this.activityService.addFollowActivity({
      ownerId: user?.id,
      authorId: myId,
      followFollowerId: response.followerId,
      followFollowingId: response.followingId,
    });

    return { status: 'ok' };
  }

  @UseGuards(OptionalUserGuard)
  @Get(Route.UserPosts)
  async getUserPosts(
    @Req() req: Request,
    @Param('nickname') nickname: string
  ): Promise<ApiResponse[Route.UserPosts]> {
    // const tags = (req.query?.tags as string)?.split(',');
    // const cursor = req.query?.cursor as string;
    // const published =
    //   typeof req.query?.published === 'string'
    //     ? JSON.parse(req.query?.published)
    //     : undefined;

    // const myId = getMyIdByReq(req);
    // const user = await this.userService.getUserByNickname({ nickname });

    // const posts = await this.userService.getUserPosts({
    //   userId: user?.id,
    //   isMe: !!myId && myId === user?.id,
    //   tags,
    //   cursor,
    //   published,
    // });

    return this.postActions.getUserPosts({ nickname });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:nickname/unfollow')
  async unfollowUser(@Req() req: Request, @Param('nickname') nickname: string) {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    await this.activityService.removeFollowActivity({
      followFollowingId: user?.id,
      followFollowerId: myId,
    });

    await this.followService.unfollowUser({
      followingUserId: user?.id,
      followerUserId: myId,
    });

    return { status: 'ok' };
  }

  @Get(Route.UserTags)
  async getUserTags(
    @Param('nickname') nickname: string
  ): Promise<ApiResponse[Route.UserTags]> {
    return [];
    // return this.userService.getUserTags({ nickname });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:nickname/update')
  async updateProfile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('nickname') nickname: string,
    @Body() body: UpdateUserDto
  ) {
    const user = await this.userService.getUserByNickname({ nickname });
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        nickname: body.newNickname,
      },
      select: {
        nickname: true,
      },
    });

    if (existingUser && existingUser?.nickname !== body.newNickname) {
      res.status(400);
      return {
        error: 'User with this nickname already exists.',
      };
    }

    const token = await axios(
      `${this.configService.get('auth.domain')}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          grant_type: 'client_credentials',
          client_id: this.configService.get('auth.clientId'),
          client_secret: this.configService.get('auth.clientSecret'),
          audience: this.configService.get('auth.authManagerAudience'),
        },
      }
    )
      .then((res) => res.data)
      .catch((err) => {
        res.status(400);
        return processErrorResponse(err);
      });

    await axios(
      `${this.configService.get('auth.domain')}/api/v2/users/${req?.user?.sub}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        data: {
          picture: body.image,
          name: body.name,
          nickname: body.newNickname,
          password: body.password,
          email: body.email,
        },
      }
    )
      .then((res) => res.data)
      .catch((err) => res.status(400).send(processErrorResponse(err)));

    await this.userService.updateUserSettings({
      userId: user?.id,
      image: body.image,
      name: body.name,
      nickname: body.newNickname,
      password: body.password,
      email: body.email,
    });

    // await this.cacheService.del(
    //   this.cacheKeyService.createUserKey({ nickname })
    // );

    return { status: 'ok' };
  }
}
