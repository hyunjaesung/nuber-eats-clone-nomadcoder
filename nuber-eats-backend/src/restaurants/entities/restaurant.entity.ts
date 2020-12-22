import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // Object Type 리턴 만들어줌 Resolver로 연결
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((_) => Number)
  id: number;

  @Field((_) => String)
  @Column()
  name: string;
  @Field((_) => Boolean)
  @Column()
  isVegan?: Boolean;
  @Field((_) => String)
  @Column()
  address: string;
  @Field((_) => String)
  @Column()
  ownerName: string;
  @Field((_) => String)
  @Column()
  categoryName: string;
}
