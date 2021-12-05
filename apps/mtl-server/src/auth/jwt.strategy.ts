import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://my-tiny-library.eu.auth0.com/.well-known/jwks.json',
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: 'https://api.mytinylibrary.com',
      issuer: 'https://my-tiny-library.eu.auth0.com/',
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): any {
    console.error({ payload });
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
