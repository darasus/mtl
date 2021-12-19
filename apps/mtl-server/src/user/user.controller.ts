import {
  Body,
  Controller,
  Get,
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
import { Request, Response } from '@mtl/types';
import axios from 'axios';

import { UserService } from './user.service';
import { processErrorResponse } from '../utils/error';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@mtl/api-types';

export class UpdateUserDto {
  nickname: string;
  email: string;
  name: string;
  password: string;
  image: string;
}

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
    private readonly activityService: ActivityService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  @Get('user/:userId')
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    res.send(await this.userService.getUserById({ userId }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId/activity')
  async getUserActivity(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @Query('take') take: string,
    @Query('cursor') cursor: string
  ) {
    const myId = req?.user?.sub?.split('|')?.[1];

    if (myId !== userId) return res.status(403).send({ error: 'Forbidden' });

    res.send(
      await this.userService.getUserActivity({
        userId: myId,
        take: Number(take) || undefined,
        cursor,
      })
    );
  }

  @Get('user/:userId/follow/count')
  async getFollowerCount(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    res.send(await this.userService.getUserFollowerCount({ userId }));
  }

  @Get('user/:userId/followings/count')
  async getFollowingCount(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    res.send(await this.userService.getUserFollowingsCount({ userId }));
  }

  @UseGuards(OptionalUserGuard)
  @Get('user/:userId/follow')
  async doIFollow(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    const myId = req?.user?.sub?.split('|')?.[1];

    if (!myId) return res.send({ doIFollow: false });

    res.send(
      await this.followService.doIFollow({
        followerUserId: myId,
        followingUserId: userId,
      })
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:userId/follow')
  async follow(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    const myId = req?.user?.sub?.split('|')?.[1];

    const response = await this.followService.followUser({
      followingUserId: userId,
      followerUserId: myId,
    });

    await this.activityService.addFollowActivity({
      ownerId: userId,
      authorId: myId,
      followFollowerId: response.followerId,
      followFollowingId: response.followingId,
    });

    res.send({ status: 'ok' });
  }

  @UseGuards(OptionalUserGuard)
  @Get('user/:userId/posts')
  async getUserPosts(
    @Req() req: Request,
    @Param('userId') userId: string
  ): Promise<ApiResponse['user/:userId/posts']> {
    const myId = req?.user?.sub?.split('|')?.[1];

    const posts = await this.userService.getUserPosts({
      userId,
      isMe: !!myId && myId === userId,
    });

    return posts;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:userId/unfollow')
  async unfollowUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    const myId = req?.user?.sub?.split('|')?.[1];

    await this.activityService.removeFollowActivity({
      followFollowingId: userId,
      followFollowerId: myId,
    });

    await this.followService.unfollowUser({
      followingUserId: userId,
      followerUserId: myId,
    });

    res.send({ status: 'ok' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:userId/update')
  async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto
  ) {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        nickname: body.nickname,
      },
      select: {
        nickname: true,
      },
    });

    if (existingUser && existingUser?.nickname !== body.nickname) {
      return res.status(400).send({
        error: 'User with this nickname already exists.',
      });
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
      .catch((err) => res.status(400).send(processErrorResponse(err)));

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
          nickname: body.nickname,
          password: body.password,
          email: body.email,
        },
      }
    )
      .then((res) => res.data)
      .catch((err) => res.status(400).send(processErrorResponse(err)));

    await this.userService.updateUserSettings({
      userId: userId,
      image: body.image,
      name: body.name,
      nickname: body.nickname,
      password: body.password,
      email: body.email,
    });

    res.send({ status: 'ok' });
  }
}
