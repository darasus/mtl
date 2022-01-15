import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Post,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { OptionalUserGuard } from '../guards/OptionalUserGuard';
import { Request, Response } from 'express';
import { ApiResponse } from '@mtl/api-types';
import { Route } from '@mtl/types';
import { rejectNil } from '@mtl/utils';
import { userRepository } from '../redis/entities/user';
import { redisConnect } from '../redis/redis.client';
import cuid = require('cuid');
import * as bcrypt from 'bcrypt';

@Controller()
export class Auth0Controller {
  // create
  @Post('/auth0/create')
  async create(@Req() req: Request, @Res() res: Response) {
    console.log('create');

    try {
      await redisConnect();

      const existingUser = await userRepository
        .search()
        .where('email')
        .equals(req.body.email)
        .return.first();

      if (existingUser) {
        return res.status(403).send({ message: 'User already exists' });
      }

      const user = await userRepository.createAndSave({
        id: cuid(),
        nickname: req.body.email,
        name: req.body.email,
        email: req.body.email,
        image: '/user-image.png',
        password: bcrypt.hashSync(req.body.password, 10),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        emailVerified: false,
        postIds: [],
        commentIds: [],
        likeIds: [],
        followerIds: [],
        followingIds: [],
      });

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      return res.status(400).send({ status: 'failure' });
    }
  }

  // login
  @Get('/auth0/login')
  async login(@Req() req: Request, @Res() res: Response) {
    console.log('login');

    try {
      await redisConnect();
      const user = await userRepository
        .search()
        .where('email')
        .equals(req.body.email)
        .and('password')
        .equals(bcrypt.hashSync(req.body.password, 10))
        .return.first();

      if (!user) {
        return res.status(401).send({ message: 'User not found' });
      }

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      return res.status(400).send({ status: 'failure' });
    }
  }

  // get user
  @Get('/auth0/user')
  async getUser(@Req() req: Request, @Res() res: Response) {
    console.log('get user');

    try {
      await redisConnect();
      const user = await userRepository
        .search()
        .where('email')
        .equals(req.body.email)
        .return.first();

      if (!user) {
        return res.status(401).send({ message: 'User not found' });
      }

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      res.status(400).send({ status: 'failure' });
    }
  }

  // verify
  @Put('/auth0/user/verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    console.log('verify');

    try {
      await redisConnect();
      const user = await userRepository
        .search()
        .where('email')
        .equals(req.body.email)
        .return.first();

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      user.emailVerified = true;
      user.updatedAt = new Date().toISOString();

      await userRepository.save(user);

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      return res.status(400).send({ status: 'failure' });
    }
  }

  // change password
  @Put('/auth0/user')
  async putUser(@Req() req: Request) {
    console.log('change password');
    return { status: 'ok' };
  }

  // delete user
  @Delete('/auth0/user')
  async deleteUser(@Req() req: Request) {
    console.log('delete user');
    return { status: 'ok' };
  }
}
