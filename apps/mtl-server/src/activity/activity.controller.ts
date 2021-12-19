import { Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from '@mtl/types';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('activity/:activityId/markAsRead')
  async markActivityAsRead(
    @Res() res: Response,
    @Param('activityId') activityId: string
  ) {
    res.send(await this.activityService.markActivityAsRead({ activityId }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('activity/markAllAsRead')
  async markAllActivityAsRead(@Req() req: Request, @Res() res: Response) {
    const myId = req?.user?.sub?.split('|')?.[1];

    res.send(
      await this.activityService.markAllActivityAsRead({ userId: myId })
    );
  }
}
