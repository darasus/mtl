import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { processErrorResponse } from '../utils/error';
import * as qs from 'query-string';

@Controller()
export class ScreenshotController {
  constructor(private readonly configService: ConfigService) {}

  @Get('screenshot')
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Query('id') id: string
  ) {
    const query = qs.stringify({ id });
    try {
      const response = await axios.request<ArrayBuffer>({
        url: `${this.configService.get(
          'app.screenshotBaseUrl'
        )}/api/screenshot?${query}`,
        responseType: 'arraybuffer',
      });

      res.status(200).send(Buffer.from(new Uint8Array(response.data)));
    } catch (error) {
      res.status(300).send(processErrorResponse(error));
    }
  }
}
