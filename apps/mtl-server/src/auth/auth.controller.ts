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
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(private userService: UserService) {}
  // create
  @Post('/auth0/create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.userService.register(req.body);

      return res.send({
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  // login
  @Post('/auth0/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.userService.login(req.body);

      const payload = {
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
        picture: user.image,
      };

      return res.status(200).send(payload);
    } catch (error) {
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
    try {
      const user = await this.userService.getUserByEmail({
        email,
      });

      const payload = {
        user_id: user.id,
        nickname: user.nickname,
        email: user.email,
        emailVerified: user.emailVerified,
        picture: user.image,
      };

      return res.status(200).send(payload);
    } catch (error) {
      return res.status(401).send(error);
    }
  }

  // verify
  @Put('/auth0/user/verify')
  async verify(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.userService.verifyEmail(req.body);

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
    try {
      const user = await this.userService.changePassword(req.body);

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
    return { status: 'ok' };
  }
}
