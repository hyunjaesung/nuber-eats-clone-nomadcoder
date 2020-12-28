import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-acount.dto';
import { LoginInput } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dto/edit-profile.dto';
import { EmailVerification } from './entities/emailVerification.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerification: Repository<EmailVerification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    // 새로운 유저 이메일 존재하는지 확인
    // 유저 생성 & 비밀번호 해싱
    try {
      const exists = await this.users.findOne({
        email,
      });
      if (exists) {
        // make error
        return { ok: false, error: '계정을 생성할수 없습니다' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.emailVerification.save(
        this.emailVerification.create({
          user,
        }),
      );

      return { ok: true };
    } catch (e) {
      return { ok: true, error: '계정을 생성할수 없습니다' };
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
      const user = await this.users.findOne({ email });
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

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
      user.verified = false;
      await this.emailVerification.save(
        this.emailVerification.create({ user }),
      );
      // user 생길때 emailVerification 도 같이 생성
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
    // update 메서드는 단순히 DB 변경만 하기때문에 entity에서 @BeforeUpdate가 동작하지 않는다
    // save는 있으면 추가하고 없으면 update 한다 이때 entity를 통과한다
  }
}
