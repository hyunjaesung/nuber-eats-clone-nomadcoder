import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
  // guard를 앱 전체에서 모든 req에 사용하고싶다면 APP_GUARD 상수 사용
})
export class AuthModule {}
