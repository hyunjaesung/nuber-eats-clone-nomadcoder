import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
// Guard 를 이용하면 Endpoint 보호 가능
export class AuthGuard implements CanActivate {
  // CanActivate 은 return true면
  // request 계속 진행 시키고
  // 아니면 request 중단 시킴

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'allowedRole',
      context.getHandler(),
    ); // 요청 마다 설정된 메타 데이터 읽어오기

    if (!roles) {
      // resolver에 role 메타데이터 설정 안되있으면 해당 req 허가
      // 예 로그인 필요없는 경우의 요청들
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    // http 요청과 gql 형태 달라서 변형
    const user: User = gqlContext['user'];
    if (!user) {
      // 유저 데이터가 없는 경우 req 거부
      return false;
    }
    if (roles.includes('Any')) {
      // Any 면 모두 허가
      return true;
    }

    return roles.includes(user.role);
    // 메타 데이터와 user의 role이 일치하는 경우만 true 리턴
  }
}
