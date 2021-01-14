import { CoreOutput } from './../../common/dto/output.dto';

import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
