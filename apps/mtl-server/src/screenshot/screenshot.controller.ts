import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from '../types/Response';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ScreenshotController {
  constructor(private readonly configService: ConfigService) {}

  @Get('screenshot')
  async screenshot(@Res() res: Response, @Query('query') query: string) {
    const response = await axios.request<ArrayBuffer>({
      url: `${this.configService.get(
        'app.screenshotBaseUrl'
      )}/api/screenshot?${query}`,
      responseType: 'arraybuffer',
    });

    res.status(200).send(Buffer.from(new Uint8Array(response.data)));
  }
}
