import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/rewardNative.entity';
import { RewardNativeService } from './rewardNative.service';
import {DependencyServiceModule} from "../../../dependencyServiceModule.module";

@Module({
  imports: [TypeOrmModule.forFeature([Account]), DependencyServiceModule],
  providers: [RewardNativeService],
  exports: [RewardNativeService],
})
export class RewardNativeModule {}
