import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/voteNative.entity';
import { VoteNativeService } from './voteNative.service';
import {DependencyServiceModule} from "../../../dependencyServiceModule.module";

@Module({
  imports: [TypeOrmModule.forFeature([Account]), DependencyServiceModule],
  providers: [VoteNativeService],
  exports: [VoteNativeService],
})
export class VoteNativeModule {}
