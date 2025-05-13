/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from 'src/utils/jwt-payload.interface';
import {
  INVALID_TOKEN,
  NO_TOKEN,
  NO_USER_ACTIVE,
  NO_USER_IN_PAYLOAD,
} from 'src/utils/AuthValidators';

@Injectable()
export class UserGuardGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException(NO_TOKEN);

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.authService.findUserById(
        Number(payload.id),
        token,
      );
      if (!user) throw new UnauthorizedException(NO_USER_IN_PAYLOAD);
      if (!user.status) throw new UnauthorizedException(NO_USER_ACTIVE);
      request['user'] = user;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException(INVALID_TOKEN);
    }
    return Promise.resolve(true);
  }

  public extractTokenFromHeader(request: Request) {
    // Cast request to any to access authorization header
    const [type, token] =
      (request as any).headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
