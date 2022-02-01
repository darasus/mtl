import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PusherService {
  pusher: Pusher;

  constructor(configService: ConfigService) {
    this.pusher = new Pusher({
      appId: configService.get('pusher.appId') as string,
      key: configService.get('pusher.key') as string,
      secret: configService.get('pusher.secret') as string,
      cluster: configService.get('pusher.cluster') as string,
      useTLS: configService.get('pusher.useTLS'),
    });
  }
}
