import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable() // 의존성 주입 가능 하게 끔
export class JwtMiddleware implements NestMiddleware {
  // implements 는 extends와 다르게 클래스가 interface 처럼 동작 해야한다
  constructor(
    private readonly jwtService: JwtService, // 글로벌 모듈이라서 의존성 주입 바로된다
    private readonly userService: UsersService, // user.module이 export 해야 쓸수 있음
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          try {
            const user = await this.userService.findById(decoded['id']);
            req['user'] = user;
          } catch (error) {}
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
