import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('activity/:activityId/markAsRead')
  async markActivityAsRead(@Param('activityId') activityId: string) {
    return this.activityService.markActivityAsRead({ activityId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('activity/markAllAsRead')
  async markAllActivityAsRead(@Req() req: Express.Request) {
    const myId = req?.user?.sub?.split('|')?.[1];

    return this.activityService.markAllActivityAsRead({ userId: myId });
  }
}
