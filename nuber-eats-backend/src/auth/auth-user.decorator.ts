import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// 커스텀 param 데코레이터 만들기
export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // http 요청과 gql 형태 달라서 변형;
    const user = gqlContext['user'];
    return user;
  },
);
