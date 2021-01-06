import { Restaurant } from '../entities/restaurant.entity';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PaginationOutput {
  @Field((type) => [Restaurant], { nullable: true })
  results?: Restaurant[];
}
