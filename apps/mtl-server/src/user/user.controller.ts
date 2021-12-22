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
import { Request, Response, User } from '@mtl/types';
import axios from 'axios';

import { UserService } from './user.service';
import { processErrorResponse } from '../utils/error';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@mtl/api-types';
import { getMyIdByReq } from '../utils/getMyIdByReq';

export class UpdateUserDto {
  newNickname: string;
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

  @Get('user/:nickname')
  async getUserById(@Param('nickname') nickname: string): Promise<User> {
    return this.userService.getUserByNickname({ nickname });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:nickname/activity')
  async getUserActivity(
    @Req() req: Request,
    @Res() res: Response,
    @Param('nickname') nickname: string,
    @Query('take') take: string,
    @Query('cursor') cursor: string
  ) {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    if (myId !== user?.id) return res.status(403).send({ error: 'Forbidden' });

    return res.send(
      await this.userService.getUserActivity({
        userId: myId,
        take: Number(take) || undefined,
        cursor,
      })
    );
  }

  @Get('user/:nickname/follow/count')
  async getFollowerCount(
    @Req() req: Request,
    @Res() res: Response,
    @Param('nickname') nickname: string
  ) {
    const user = await this.userService.getUserByNickname({ nickname });
    res.send(await this.userService.getUserFollowerCount({ userId: user?.id }));
  }

  @Get('user/:nickname/followings/count')
  async getFollowingCount(
    @Req() req: Request,
    @Res() res: Response,
    @Param('nickname') nickname: string
  ) {
    const user = await this.userService.getUserByNickname({ nickname });
    res.send(
      await this.userService.getUserFollowingsCount({ userId: user?.id })
    );
  }

  @UseGuards(OptionalUserGuard)
  @Get('user/:nickname/follow')
  async doIFollow(
    @Req() req: Request,
    @Res() res: Response,
    @Param('nickname') nickname: string
  ) {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    if (!myId) return res.send({ doIFollow: false });

    res.send(
      await this.followService.doIFollow({
        followerUserId: myId,
        followingUserId: user?.id,
      })
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:nickname/follow')
  async follow(
    @Req() req: Request,
    @Res() res: Response,
    @Param('nickname') nickname: string
  ) {
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

    res.send({ status: 'ok' });
  }

  @UseGuards(OptionalUserGuard)
  @Get('user/:nickname/posts')
  async getUserPosts(
    @Req() req: Request,
    @Param('nickname') nickname: string
  ): Promise<ApiResponse['user/:nickname/posts']> {
    const myId = getMyIdByReq(req);
    const user = await this.userService.getUserByNickname({ nickname });

    const posts = await this.userService.getUserPosts({
      userId: user?.id,
      isMe: !!myId && myId === user?.id,
    });

    return posts;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:nickname/unfollow')
  async unfollowUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('nickname') nickname: string
  ) {
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

    res.send({ status: 'ok' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:nickname/update')
  async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
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

    res.send({ status: 'ok' });
  }
}
