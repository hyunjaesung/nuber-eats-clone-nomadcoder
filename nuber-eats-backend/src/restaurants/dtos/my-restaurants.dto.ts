import { CoreOutput } from './../../common/dto/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';

import { Restaurant } from '../entities/restaurant.entity';

@ObjectType()
export class MyRestaurantsOutput extends CoreOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
