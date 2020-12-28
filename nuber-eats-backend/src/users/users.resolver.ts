import { User } from './entities/user.entity';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  CreateAccountOutput,
  CreateAccountInput,
} from './dto/create-acount.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver((_) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query((_) => Boolean)
  hi() {
    return true;
  }
  @Mutation((_) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const [ok, error] = await this.usersService.createAccount(
        createAccountInput,
      );
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  @Mutation((_) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const { ok, error, token } = await this.usersService.login(loginInput);
      return { ok, error, token };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Query((returns) => User)
  @UseGuards(AuthGuard) // 가드 적용 false 리턴이면 해당 쿼리 request 중단
  me(@AuthUser() authedUser: User) {
    return authedUser;
  }
}
