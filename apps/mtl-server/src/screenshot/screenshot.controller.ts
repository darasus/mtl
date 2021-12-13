import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from '../types/Response';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { processErrorResponse } from '../utils/error';
import * as qs from 'query-string';

@Controller()
export class ScreenshotController {
  constructor(private readonly configService: ConfigService) {}

  @Get('screenshot')
  async screenshot(@Res() res: Response, @Query('url') url: string) {
    console.log(
      `${this.configService.get('app.screenshotBaseUrl')}/api/screenshot?${url}`
    );
    const query = qs.stringify({ url });
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
