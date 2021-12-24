import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { OptionalUserGuard } from '../guards/OptionalUserGuard';
import { rejectNil } from '../utils/rejectNil';
import { FeedService } from './feed.service';
import { Request } from 'express';
import { ApiResponse } from '@mtl/api-types';

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
    @Query('feedType') feedType: FeedType,
    @Query('cursor') cursor?: string,
    @Query('take') take?: string
  ): Promise<ApiResponse['feed']> {
    const params = rejectNil({
      userId: req?.user?.sub?.split('|')?.[1],
      cursor,
      take,
    });

    if (feedType === FeedType.Following) {
      return this.feedService.fetchFollowingFeed(params);
    }

    if (feedType === FeedType.Latest) {
      return this.feedService.fetchLatestFeed(params);
    }
  }
}
