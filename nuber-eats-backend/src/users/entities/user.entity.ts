import { Entity, Column, BeforeInsert } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  ObjectType,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

// 순서대로 graphQLScheme Entity 작업
@InputType({ isAbstract: true }) // DTO 작업 맨위에 있어야한다
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      console.log(this.password);
      this.password = await bcrypt.hash(this.password, 10);
      console.log(this.password);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException();
    }
  }

  @Field((type) => String)
  @Column()
  email: string;

  @Field((type) => String)
  @Column()
  password: string;

  // enum 가능하게 작업
  @Field((type) => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;
}
