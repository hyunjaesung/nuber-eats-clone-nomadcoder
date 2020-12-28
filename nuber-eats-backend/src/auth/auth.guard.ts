import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
// Guard 를 이용하면 Endpoint 보호 가능
export class AuthGuard implements CanActivate {
  // CanActivate 은 return true면
  // request 계속 진행 시키고
  // 아니면 request 중단 시킴

  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // http 요청과 gql 형태 달라서 변형
    const user = gqlContext['user'];
    console.log(user);
    if (!user) {
      return false;
    }
    return true;
  }
}
