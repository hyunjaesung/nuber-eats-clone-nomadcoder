import { InputType, Field, ArgsType } from '@nestjs/graphql';
import { IsString, Length, IsBoolean } from 'class-validator';
// class-validator 이용해서 클래스 유효성 검증가능
// @InputType()
@ArgsType()
export class CreateRestaurantDto {
  @Field((_) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((_) => Boolean)
  @IsBoolean()
  isVegan?: Boolean;

  @Field((_) => String)
  @IsString()
  address: string;

  @Field((_) => String)
  @IsString()
  @Length(5, 10)
  ownerName: string;
}
