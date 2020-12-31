import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  ObjectType,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

// 순서대로 graphQLScheme Entity 작업
@InputType('UserInputType', { isAbstract: true }) // DTO 작업 맨위에 있어야한다
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @BeforeInsert()
  @BeforeUpdate() // 업데이트시 이거 추가해야 해당칼럼 해쉬화 된다!
  async hashPassword(): Promise<void> {
    if (this.password) {
      // password가 전달 될때 만 변경
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.warn(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException();
    }
  }

  @Field((type) => String)
  @Column({ unique: true })
  // Marks column as unique column (creates unique constraint).
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  // select false 하면 user 레포 소환시 password 안 담아 준다
  @IsString()
  password: string;

  // enum 가능하게 작업
  @Field((type) => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];
}
