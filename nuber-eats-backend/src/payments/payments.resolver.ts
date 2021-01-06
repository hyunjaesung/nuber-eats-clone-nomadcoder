import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payments.service';
import { Role } from 'src/auth/role.decorator';
import {
  CreatePaymentOuput,
  CreatePaymentInput,
} from './dtos/create-payment.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver((of) => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation((returns) => CreatePaymentOuput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOuput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }
}
