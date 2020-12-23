import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigService],
  // app.module에 설정한 환경값 가져오기위해 ConfigService 이용
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
