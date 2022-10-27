import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  IJwtServicePayload,
} from '../../../domain/interfaces/jwt.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }

  createToken(payload: IJwtServicePayload): string {
    return this.jwtService.sign(payload);
  }
}
