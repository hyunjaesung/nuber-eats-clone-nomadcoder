import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-acount.dto';
import { Mutation, Args } from '@nestjs/graphql';
import { LoginOutput, LoginInput } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService, // 설정값 쓰기위해 ConfigService inject
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    // 새로운 유저 이메일 존재하는지 확인
    // 유저 생성 & 비밀번호 해싱
    try {
      const exists = await this.users.findOne({
        email,
      });
      if (exists) {
        // make error
        return [false, '이미 있는 이메일 계정입니다'];
      }
      await this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (e) {
      return [false, '계정을 생성할 수 없습니다'];
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
      const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      // this.config로 env값 가져온다
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { error, ok: false };
    }
  }
}
