import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';

@InputType({ isAbstract: true }) // DTO 작업 맨위에 있어야한다
@ObjectType()
@Entity()
export class EmailVerification extends CoreEntity {
  // one to one 오직 하나의 유저, 오직 하나의 EmailVerification 서로 관계
  @Column()
  @Field((type) => String)
  code: string;

  // JoinColumn은 어디서 내가 접근 하고싶은지 에 따라서 넣는 Entity가 달라진다
  // 여기에 넣으면 EmailVerification 부터 User로 관계 찾는다
  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @BeforeInsert() // 이거 넣어야지 코드 생성되면서 code 칼럼에 랜덤 문자 들어간다
  createCode(): void {
    this.code = Math.random().toString(36);
  }
}
