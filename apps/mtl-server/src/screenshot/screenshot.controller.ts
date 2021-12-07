import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from '../types/Response';
import axios from 'axios';

@Controller()
export class ScreenshotController {
  @Get('screenshot')
  async screenshot(@Res() res: Response, @Query('query') query: string) {
    const response = await axios.request<ArrayBuffer>({
      url: `${process.env.SCREENSHOT_API_BASE_URL}/api/screenshot?${query}`,
      responseType: 'arraybuffer',
    });

    res.status(200).send(Buffer.from(new Uint8Array(response.data)));
  }
}
