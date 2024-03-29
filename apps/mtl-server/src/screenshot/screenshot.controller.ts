import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as qs from 'query-string';
import { CacheService } from '../cache/cache.service';
import { CacheKeyService } from '../cache/cacheKey.service';
import { Route } from '@mtl/types';
import { ApiResponse } from '@mtl/api-types';
import { processErrorResponse, years } from '@mtl/utils';

@Controller()
export class ScreenshotController {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly cacheKeyService: CacheKeyService
  ) {}

  @Get(Route.PostScreenshot)
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Query('id') id: string,
    @Query('updateDate') updateDate: string,
    @Query('width') width: string,
    @Query('height') height: string
  ): Promise<ApiResponse[Route.PostScreenshot]> {
    const query = qs.stringify({ id, updateDate, width, height });
    const cacheKey = this.cacheKeyService.createScreenshotKey({
      id,
      updateDate,
    });
    try {
      const cachedResponse = await this.cacheService.getBuffer(cacheKey);

      if (cachedResponse) {
        res.status(200).send(cachedResponse);
      }

      const response = await axios.request<ArrayBuffer>({
        url: `${this.configService.get(
          'app.screenshotBaseUrl'
        )}/api/screenshot?${query}`,
        responseType: 'arraybuffer',
      });

      await this.cacheService.setBuffer(cacheKey, response.data, years(1));

      res.status(200).send(Buffer.from(new Uint8Array(response.data)));
    } catch (error) {
      res.status(300).send(processErrorResponse(error));
    }
  }
}
