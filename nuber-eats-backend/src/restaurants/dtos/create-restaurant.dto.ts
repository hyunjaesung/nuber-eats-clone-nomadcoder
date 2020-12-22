import { InputType, Field, ArgsType, OmitType } from '@nestjs/graphql';
import { IsString, Length, IsBoolean } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';
// class-validator 이용해서 클래스 유효성 검증가능
@InputType() // MappedType에서는 InputType
// @ArgsType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  // InputType,
) {
  // 생성되는 id는 제외
  // 부모인 Restaurant는 InputType이 아닌  ObjectType이라서 처리 필요
  // 이런 경우 마지막 인자로 변환 시킬 타입 넣어 줄수 있다
  // 저렇게 안쓰고싶을 경우 해당 스키마 entity에 isAbstract true 로 InputType 추가해도된다
  //
  // 예전 ArgsType일때 DTO
  // @Field((_) => String)
  // @IsString()
  // @Length(1, 10)
  // name: string;
  // @Field((_) => Boolean)
  // @IsBoolean()
  // isVegan?: Boolean;
  // @Field((_) => String)
  // @IsString()
  // address: string;
  // @Field((_) => String)
  // @IsString()
  // @Length(1, 10)
  // ownerName: string;
}

// 주의사항 Dto에 없고 Entity에만 있으면 경고도 없고
// 아무도 모르게 에러가 난다
// 이를 예방하려면 Entity가 Dto도 자동 수행하도록 하면된다
// Entity가 DB table, graphql type 뿐만 아니라 dto 모두 가능하도록 수정
