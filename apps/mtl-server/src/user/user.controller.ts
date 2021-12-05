import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
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
