import { ObjectType, Field } from '@nestjs/graphql';
import { filter } from 'minimatch';

@ObjectType() // Object Type 리턴 만들어줌 Resolver로 연결
export class Restaurant {
  @Field((_) => String)
  name: string;
  @Field((_) => Boolean)
  isVegan?: Boolean;
  @Field((_) => String)
  address: string;
  @Field((_) => String)
  ownerName: string;
}
