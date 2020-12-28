import { CoreOutput } from 'src/common/dto/output.dto';
import { ObjectType, PickType, PartialType, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
