import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@InputType({ isAbstract: true })
// 스키마에는 추가안하고 타입 하나 더쓰고 싶을때
@ObjectType() // Object Type 리턴 만들어줌 Resolver로 연결
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  id: number;

  @Field((_) => String)
  @Column()
  @IsString()
  @Length(1, 10)
  // entity 역시 class-validator 설정대로 검증가능
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((_) => String)
  @Column()
  @IsString()
  @Length(1, 10)
  address: string;

  // relations
  @Field((type) => Category)
  @ManyToOne((type) => Category, (category) => category.restaurants)
  category: Category;
}
