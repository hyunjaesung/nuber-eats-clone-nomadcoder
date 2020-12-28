import { CoreOutput } from 'src/common/dto/output.dto';
import { ObjectType, PickType, InputType } from '@nestjs/graphql';
import { EmailVerification } from '../entities/emailVerification.entity';

@ObjectType()
export class verifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(EmailVerification, ['code']) {}
