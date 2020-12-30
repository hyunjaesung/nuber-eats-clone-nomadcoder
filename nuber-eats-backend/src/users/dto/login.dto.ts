import { CoreOutput } from 'src/common/dto/output.dto';
import { ObjectType, Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true }) // 없을수도 있다
  token?: string;
}
