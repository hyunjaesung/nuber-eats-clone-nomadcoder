import { Module, Global } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common.constant';
@Global()
@Module({
  exports: [PUB_SUB],
  providers: [
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
})
export class CommonModule {}
