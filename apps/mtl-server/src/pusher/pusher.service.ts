import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PusherService {
  pusher: Pusher;

  constructor(configService: ConfigService) {
    console.log({
      appId: configService.get('pusher.appId'),
      key: configService.get('pusher.key'),
      secret: configService.get('pusher.secret'),
      cluster: configService.get('pusher.cluster'),
      useTLS: configService.get('pusher.useTLS'),
    });
    this.pusher = new Pusher({
      appId: configService.get('pusher.appId'),
      key: configService.get('pusher.key'),
      secret: configService.get('pusher.secret'),
      cluster: configService.get('pusher.cluster'),
      useTLS: configService.get('pusher.useTLS'),
    });
  }
}
