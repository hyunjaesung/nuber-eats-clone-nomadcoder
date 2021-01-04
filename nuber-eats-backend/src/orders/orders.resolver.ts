import { PubSub } from 'graphql-subscriptions';
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';
import { GetOrdersOutput, GetOrdersInput } from './dtos/get-orders.dto';
import { GetOrderOutput, GetOrderInput } from './dtos/get-order.dto';
import { EditOrderOutput, EditOrderInput } from './dtos/edit-order.dto';

const pubSub = new PubSub();
// PubSub은 Publish and Subscription

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly ordersService: OrderService) {}

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }
  @Mutation((returns) => Boolean)
  potatoReady() {
    pubSub.publish('hotPotatos', { readyPotatoes: 'Your potato love you' });
    // 첫번째는 트리거 지정한 이름, 두번째는 payload 인데 object 형태
    // key 는 메소드 이름 value는 보내고 싶은 데이터
    return true;
  }

  @Subscription((returns) => String)
  // 뭘 리턴하냐 에 따라 달라진다
  readyPotatoes() {
    // 여기선 String을 리턴하지 않고
    // asyncIterator 를 리턴할거다
    return pubSub.asyncIterator('hotPotatos');
    // 'hotPotatos' 를 트리거로 지정
  }
}
