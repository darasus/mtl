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
import { IsNotEmpty } from 'class-validator';
import { ActivityService } from '../activity/activity.service';
import { FollowService } from '../follow/follow.service';
import { OptionalUserGuard } from '../guards/OptionalUserGuard';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from '../types/Request';
import { Response } from '../types/Response';
import axios from 'axios';

import { UserService } from './user.service';
import { processErrorResponse } from '../utils/error';

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
    private readonly prismaService: PrismaService
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
        followerUserId: userId,
        followingUserId: myId,
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
    @Res() res: Response,
    @Param('userId') userId: string
  ) {
    const myId = req?.user?.sub?.split('|')?.[1];

    res.send(
      await this.userService.getUserPosts({
        userId,
        isMe: !!myId && myId === userId,
      })
    );
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

    if (existingUser && existingUser?.nickname === body.nickname) {
      return res.status(400).send({
        error: 'User with this nickname already exists.',
      });
    }

    const token = await axios(`${process.env.AUTH0_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_API_BASE_URL}/api/v2/`,
      },
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return res.status(400).send(processErrorResponse(err));
      });

    await axios(
      `${process.env.AUTH0_API_BASE_URL}/api/v2/users/${req?.user?.sub}`,
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
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return res.status(400).send(processErrorResponse(err));
      });

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
