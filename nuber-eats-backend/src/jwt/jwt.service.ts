import { Injectable, Inject } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions, // 커스텀 provider 주입 // private readonly configService: ConfigService,
  ) {}
  // 이렇게 따로 값을 inject 가능
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
    // return jwt.sign(payload, this.configService.get('PRIVATE_KEY'));
    // 사실 옵션안하고 위에서 처럼 그냥 글로벌 모듈에 속한 provider인 ConfigService 주입해서 쓰면되긴한다
  }
}
