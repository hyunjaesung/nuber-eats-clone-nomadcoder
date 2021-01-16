import { Module } from '@nestjs/common';
import {
  RestaurantResolver,
  CategoryResolver,
  DishResolver,
} from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])], // Repository 설정
  // forFeature 는 특정 feature를 import 할수있도록 한다
  providers: [
    RestaurantResolver,
    RestaurantService,
    CategoryResolver,
    DishResolver,
  ],
})
export class RestaurantsModule {}
