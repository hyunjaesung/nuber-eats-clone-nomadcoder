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
import { Inject } from '@nestjs/common';
import {
  PUB_SUB,
  NEW_PENDING_ORDER,
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
} from 'src/common/common.constant';
import { PubSub } from 'graphql-subscriptions';
import { OrderUpdatesInput } from './dtos/order-updates.dto';
import { TakeOrderOutput, TakeOrderInput } from './dtos/take.order.dto';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

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

  // @Mutation((returns) => Boolean)
  // async potatoReady(@Args('potatoId') potatoId: number) {
  //   await this.pubSub.publish('hotPotatos', {
  //     readyPotatoes: potatoId,
  //   });
  //   // 첫번째는 트리거 지정한 이름, 두번째는 payload 인데 object 형태
  //   // key 는 메소드 이름 value는 보내고 싶은 데이터
  //   return true;
  // }

  // @Subscription((returns) => String, {
  //   filter: ({ readyPotatoes }, { potatoId }, context) => {
  //     // payload는 publish 할때 보낸 데이터
  //     // variables은 subscription 할때 처음 지정한 인자
  //     // context는 gql context

  //     // 세개를 활용하면 filter 활용 가능하다
  //     return readyPotatoes === potatoId;
  //   },
  //   resolve: ({ readyPotatoes }) => {
  //     return `Your potato with the id ${readyPotatoes}`;
  //   },
  // })
  // @Role(['Any'])
  // readyPotatoes(@Args('potatoId') potatoId: number) {
  //   // 여기선 String을 리턴하지 않고
  //   // asyncIterator 를 리턴할거다
  //   return this.pubSub.asyncIterator('hotPotatos');
  //   // 'hotPotatos' 를 트리거로 지정
  // }

  @Subscription((returns) => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
      return ownerId === user.id;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription((returns) => Order)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
  }

  @Subscription((returns) => Order, {
    filter: (
      { orderUpdates: order }: { orderUpdates: Order },
      { input }: { input: OrderUpdatesInput },
      { user }: { user: User },
    ) => {
      if (
        order.driverId !== user.id &&
        order.customerId !== user.id &&
        order.restaurant.ownerId !== user.id
      ) {
        return false;
      }
      return order.id === input.id;
    },
  })
  @Role(['Any'])
  orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
    return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
  }

  @Mutation((returns) => TakeOrderOutput)
  @Role(['Delivery'])
  takeOrder(
    @AuthUser() driver: User,
    @Args('input') takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    return this.ordersService.takeOrder(driver, takeOrderInput);
  }
}
