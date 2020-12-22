import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query((returns) => [Restaurant]) // Restaurant의 resolver가됨
  // 그래프 ql에서의 배열 표기법 [Restaurant]
  // 타입을 반환하는 함수가 인자가 되야한다
  // returns 는 그냥 potato
  // 그래프ql에서는 요청을 query로 파라미터에 넣어서 요청하기 때문에 Query로 요청을 받고
  // @nestjs/graphql 모듈들이 해석 처리해준다
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }
  // 이렇게 그래프 ql 쿼리 날릴수 있게된다
  // {
  //   restaurants(veganOnly:true){
  //     name
  //   }
  // }
  @Mutation((returns) => Boolean)
  createRestaurant(
    // @Args('name') name: string,
    // @Args('isVegan') isVegan: boolean,
    // @Args('address') address: string,
    // @Args('ownerName') ownerName: string,
    // 아래와 같이 따로 DTO 선언해서 축소가능
    @Args() createRestaurantDto: CreateRestaurantDto,
  ) {
    console.log(createRestaurantDto);
    return true;
  }
  // graph ql
  // mutation{
  //   createRestaurant(
  //     name:"12",
  //     address:"213213",
  //     isVegan:false,
  //     ownerName:"hi"
  //   )
  // }
}
