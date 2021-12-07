import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from '../types/Response';
import { Request } from '../types/Request';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('activity/:activityId/markAsRead')
  async markActivityAsRead(
    @Res() res: Response,
    @Param('activityId') activityId: string
  ) {
    res.send(await this.activityService.markActivityAsRead({ activityId }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('activity/markAllAsRead')
  async markAllActivityAsRead(@Req() req: Request, @Res() res: Response) {
    const myId = req?.user?.sub?.split('|')?.[1];

    res.send(
      await this.activityService.markAllActivityAsRead({ userId: myId })
    );
  }
}
