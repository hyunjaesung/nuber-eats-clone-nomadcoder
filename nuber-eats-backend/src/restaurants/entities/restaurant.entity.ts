import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from '../../orders/entities/order.entity';

@InputType('RestaurantInputType', { isAbstract: true })
// Type 이름 Restaurant로 겹치는 문제때문에 따로 이름 설정
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
  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL', // 카테고리가 지워지더라도 레스토랑이 지워지면 안된다
  })
  category: Category;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  // 확실하게 관계 표명
  // loadRelationId나 relations 옵션으로 find 안해도 자동으로 relation id 가져다 준다
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.restaurant)
  orders: Order[];

  @Field((type) => [Dish])
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu: Dish[];

  @Field((type) => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil: Date;
}
