import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { Category } from './entities/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])], // Repository 설정
  // forFeature 는 특정 feature를 import 할수있도록 한다
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
