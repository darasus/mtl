import { Controller, Get, Param, Post } from '@nestjs/common';
import { FollowService } from '../follow/follow.service';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService
  ) {}

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('user/:id/follow/count')
  getFollowerCount(@Param('id') id: string) {
    return this.userService.getUserFollowerCount(id);
  }

  // @Get('user/:id/follow')
  // doIFollow(@Param('id') id: string) {
  //   return this.followService.doIFollow(id);
  // }

  // @Post('user/:id/follow')
  // followUser(@Param('id') id: string) {
  //   return this.userService.getUserFollowerCount(id);
  // }
}
