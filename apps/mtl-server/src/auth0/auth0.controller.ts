import {
  Controller,
  Get,
  Query,
  Req,
  Post,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserActions } from '../redis/actions/UserActions';

@Controller()
export class Auth0Controller {
  userActions = new UserActions();
  // create
  @Post('/auth0/create')
  async create(@Req() req: Request, @Res() res: Response) {
    console.log('create');

    try {
      const user = await this.userActions.register(req.body);

      console.log(user);

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }

  // login
  @Post('/auth0/login')
  async login(@Req() req: Request, @Res() res: Response) {
    console.log('login');

    try {
      const user = await this.userActions.login(req.body);

      const payload = {
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      };

      console.log({ user });
      console.log({ payload });

      return res.status(200).send(payload);
    } catch (error) {
      console.log(error);
      return res.status(401).send(error);
    }
  }

  // get user
  @Get('/auth0/user')
  async getUser(
    @Req() req: Request,
    @Res() res: Response,
    @Query('email') email: string
  ) {
    console.log('get user');

    try {
      const user = await this.userActions.getUserByEmail({
        email,
      });

      const payload = {
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
        emailVerified: user.emailVerified,
      };

      console.log(payload);

      return res.status(200).send(payload);
    } catch (error) {
      console.log(error);
      return res.status(401).send({ status: 'failure' });
    }
  }

  // verify
  @Put('/auth0/user/verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    console.log('verify');

    try {
      const user = await this.userActions.verifyEmail(req.body);

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      return error;
    }
  }

  // change password
  @Put('/auth0/user/changePassword')
  async putUser(@Req() req: Request, @Res() res: Response) {
    console.log('change password');

    try {
      const user = await this.userActions.changePassword(req.body);

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      return error;
    }
  }

  // delete user
  @Delete('/auth0/user')
  async deleteUser(@Req() req: Request) {
    console.log('delete user');
    return { status: 'ok' };
  }
}
