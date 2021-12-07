import { Controller, Get, Query, UseGuards, Req, Res } from '@nestjs/common';
import { OptionalUserGuard } from '../guards/OptionalUserGuard';
import { rejectNil } from '../utils/rejectNil';

import { FeedService } from './feed.service';
import { Request } from '../types/Request';
import { Response } from '../types/Response';

enum FeedType {
  Latest = 'latest',
  Following = 'Following',
}

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('feed')
  @UseGuards(OptionalUserGuard)
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Query('feedType') feedType: FeedType,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string
  ) {
    const params = rejectNil({
      userId: req?.user?.sub?.split('|')?.[1],
      cursor,
      take,
    });

    if (feedType === FeedType.Following) {
      res.send(await this.feedService.fetchFollowingFeed(params));
    }

    if (feedType === FeedType.Latest) {
      res.send(await this.feedService.fetchLatestFeed(params));
    }
  }
}
