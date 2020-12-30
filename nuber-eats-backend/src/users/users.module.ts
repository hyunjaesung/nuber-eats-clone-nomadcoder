import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EmailVerification } from './entities/emailVerification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerification])],
  // app.module에 설정한 환경값 가져오기위해 ConfigService 이용
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
