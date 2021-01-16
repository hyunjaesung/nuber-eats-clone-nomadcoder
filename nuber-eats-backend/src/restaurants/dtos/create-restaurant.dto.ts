import {
  InputType,
  Field,
  ArgsType,
  OmitType,
  ObjectType,
  PickType,
  Int,
} from '@nestjs/graphql';
import { IsString, Length, IsBoolean } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
// class-validator 이용해서 클래스 유효성 검증가능

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'coverImg',
  'address',
]) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
  @Field((type) => Int)
  restaurantId?: number;
}
