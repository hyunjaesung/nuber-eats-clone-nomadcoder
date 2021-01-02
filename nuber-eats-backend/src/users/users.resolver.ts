import { User } from './entities/user.entity';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  CreateAccountOutput,
  CreateAccountInput,
} from './dto/create-acount.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { EditProfileOutput, EditProfileInput } from './dto/edit-profile.dto';
import { verifyEmailOutput, VerifyEmailInput } from './dto/veryfy-email.dto';
import { Role } from 'src/auth/role.decorator';

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
    return await this.usersService.createAccount(createAccountInput);
  }

  @Mutation((_) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return await this.usersService.login(loginInput);
  }

  @Query((returns) => User)
  // @UseGuards(AuthGuard) // 가드 적용 false 리턴이면 해당 쿼리 request 중단
  @Role(['Any'])
  // 커스텀 데코레이터로 meta 데이터 설정, meta데이터 없다면 글로벌 guard에서 로그인 필요없는 것으로 구분
  me(@AuthUser() authedUser: User) {
    return authedUser;
  }

  // @UseGuards(AuthGuard)
  @Role(['Any'])
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return await this.usersService.findById(userProfileInput.userId);
  }

  // @UseGuards(AuthGuard)
  @Role(['Any'])
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authedUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return await this.usersService.editProfile(authedUser.id, editProfileInput);
  }

  @Mutation((returns) => verifyEmailOutput)
  async verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<verifyEmailOutput> {
    return await this.usersService.verifyEmail(verifyEmailInput);
  }
}
