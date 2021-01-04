import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { IsNumber, IsEnum } from 'class-validator';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  customer?: User;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  driver?: User;

  @RelationId((order: Order) => order.driver)
  driverId: number;

  @Field((type) => Restaurant, { nullable: true })
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  restaurant?: Restaurant;

  @Field((type) => [OrderItem])
  @ManyToMany((type) => OrderItem)
  // Many-to-many is a relation
  // where A contains multiple instances of B,
  // and B contain multiple instances of A
  @JoinTable()
  // dish vs OrderItem 하면 order 가 소유하는 쪽이라 여기에 써줘야한다
  items: OrderItem[];

  @Column({ nullable: true })
  @Field((type) => Float, { nullable: true })
  @IsNumber()
  total?: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  @Field((type) => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

// entity 작성 시
// 1 먼저 필요한 property부터 쓰고
// 2 enumType 있으면 등록하고
// 3 GraphQL 스키마 작성
//  - nullable 이면 nullable true 로
// 4 typeOrm 스키마 작성
//  - GraphQL이랑 크게 다르지 않는 것 column 으로
//  - 관계 필요한 항목 relations 요소 작성
//    - orders <-> user : user 하나가 많은 order를 가질 수 있음
//                        orders에선 ManyToOne
//                        user에선 OneToMany
//                        onDelete 옵션 user지워져도 주문이 남아있어야하니 SET NULL
//                        user는 customer or driver

//    - orders <-> restaurant : restaurant하나가 많은 order를 가짐
//                              위와 같은 과정

//    - orders <-> dishes : order 도 많은 dish 가질수있고 dish도 여러 order 가질수 있다
//                          Own 하는 쪽에 @JoinTable() 써줘야한다
//                          order 에서 테이블로 일대다 관계 형성
//                          테이블 에서 dish로 다대일 관계 형성
