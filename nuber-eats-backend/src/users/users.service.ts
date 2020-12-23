import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-acount.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({ email, password, role }: CreateAccountInput) {
    // 새로운 유저 이메일 존재하는지 확인
    // 유저 생성 & 비밀번호 해싱
    try {
      const exists = await this.users.findOne({
        email,
      });
      if (exists) {
        // make error
        return '이미 있는 이메일 계정입니다';
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return '계정을 생성할 수 없습니다';
    }
  }
}
