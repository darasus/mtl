import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from '../types/Response';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { processErrorResponse } from '../utils/error';

@Controller()
export class ScreenshotController {
  constructor(private readonly configService: ConfigService) {}

  @Get('screenshot')
  async screenshot(@Res() res: Response, @Param('url') url: string) {
    try {
      const response = await axios.request<ArrayBuffer>({
        url: `${this.configService.get(
          'app.screenshotBaseUrl'
        )}/api/screenshot?${url}`,
        responseType: 'arraybuffer',
      });

      res.status(200).send(Buffer.from(new Uint8Array(response.data)));
    } catch (error) {
      res.status(300).send(processErrorResponse(error));
    }
  }
}
