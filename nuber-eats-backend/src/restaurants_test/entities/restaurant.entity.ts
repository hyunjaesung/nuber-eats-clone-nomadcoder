import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, Length, IsBoolean, IsOptional } from 'class-validator';

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

  @Field((_) => Boolean, { nullable: true })
  // 그래프QL 스키마, DTO를 위해서 기본값 설정
  // DTO에 자동으로 true라고 add해줌
  // nullable:true 로 하면 아예 값도 없다
  @Column({ default: true })
  // DB를 위해서 기본값 설정
  @IsOptional()
  // class-validator 를 위한 옵셔널 설정, 있거나 말거나
  @IsBoolean()
  isVegan?: Boolean;

  @Field((_) => String)
  @Column()
  @IsString()
  @Length(1, 10)
  address: string;
}
