import { ArgsType, Field, ObjectType, InputType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Category } from '../entities/category.entity';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field((type) => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;

  @Field((type) => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
