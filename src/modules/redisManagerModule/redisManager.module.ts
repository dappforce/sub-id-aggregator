import { Global, Module } from '@nestjs/common';
import { RedisClientManagerService } from './services/redisClientManager.service';

@Global()
@Module({
  imports: [],
  providers: [RedisClientManagerService],
  exports: [RedisClientManagerService],
})
export class RedisManagerModule {}
