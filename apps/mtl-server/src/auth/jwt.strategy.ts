import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(configService: ConfigService) {
    console.log({
      AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
      AUTH0_AUTH_MANAGER_AUDIENCE: process.env.AUTH0_AUTH_MANAGER_AUDIENCE,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
      DATABASE_URL: process.env.DATABASE_URL,
      PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
      PUSHER_APP_ID: process.env.PUSHER_APP_ID,
      PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
      PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
      SCREENSHOT_API_BASE_URL: process.env.SCREENSHOT_API_BASE_URL,
    });
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('auth.domain')}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('auth.audience'),
      issuer: `${configService.get('auth.domain')}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): any {
    const minimumScope = ['openid', 'profile', 'email'];

    if (
      payload?.scope
        ?.split(' ')
        .filter((scope) => minimumScope.indexOf(scope) > -1).length !== 3
    ) {
      throw new UnauthorizedException(
        'JWT does not possess the required scope (`openid profile email`).'
      );
    }

    return payload;
  }
}
