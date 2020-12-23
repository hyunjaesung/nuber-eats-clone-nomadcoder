import { InputType, PartialType, ArgsType, Field } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}
// Restaurant로 안하고 CreateRestaurantDto로하는 이유는 id가 꼭필요하기 때문
// Restaurant로 하면 id가 optional 이된다
// id는 따로 처리해서 필수로 가져오도록 작업

@InputType()
export class UpdateRestaurantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
// id 있는거랑 없는거랑 통합
