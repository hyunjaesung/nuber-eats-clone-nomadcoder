import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-acount.dto';
import { LoginInput } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { EmailVerification } from './entities/emailVerification.entity';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { verifyEmailOutput, VerifyEmailInput } from './dto/veryfy-email.dto';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerification: Repository<EmailVerification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    // 새로운 유저 이메일 존재하는지 확인
    // 유저 생성 & 비밀번호 해싱
    try {
      const exists = await this.users.findOne(
        {
          email,
        },
        { select: ['id', 'password'] },
      );
      if (exists) {
        // make error
        return { ok: false, error: '계정을 생성할수 없습니다' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.emailVerification.save(
        this.emailVerification.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '계정을 생성할수 없습니다' };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // 이메일 유저를 찾는다
    // 비밀번호와 일치하는지 확인한다
    // JWT 만들어서 전달
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '유저 검색 실패',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '틀린 비밀번호',
        };
      }
      // 토큰 생성
      const token = this.jwtService.sign({ id: user.id });
      // this.config로 env값 가져온다
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { error, ok: false };
    }
  }
  async userProfile({ userId }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id: userId });
      if (user) {
        return {
          ok: true,
          user,
        };
      } else {
        throw Error('유저를 찾을 수 없습니다');
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: '찾을 수 없습니다' };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.emailVerification.save(
          this.emailVerification.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code); // email 인증 한번더
        // user 생길때 emailVerification 도 같이 생성
      }
      if (password) {
        user.password = password;
      }
      this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '찾을 수 없는 계정 입니다',
      };
    }

    // update 메서드는 단순히 DB 변경만 하기때문에 entity에서 @BeforeUpdate가 동작하지 않는다
    // save는 있으면 추가하고 없으면 update 한다 이때 entity를 통과한다
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<verifyEmailOutput> {
    try {
      const verification = await this.emailVerification.findOne(
        { code },
        // { loadRelationIds: true },
        { relations: ['user'] },
        // 위 둘 옵션 있어야지 relation 관련 컬럼 가지고 온다
        // relation은 상당히 복잡한 작업이기 때문에 옵션으로 요청을 해야한다
      );
      if (verification) {
        verification.user.verified = true;
        this.users.save(verification.user);
        // await this.users.update(verification.user.id, { verified: true });
        return {
          ok: true,
        };
      }
      throw Error();
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
