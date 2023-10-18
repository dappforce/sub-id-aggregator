import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/transferNative.entity';
import { TransferNativeService } from './transferNative.service';
import {DependencyServiceModule} from "../../../dependencyServiceModule.module";

@Module({
  imports: [TypeOrmModule.forFeature([Account]), DependencyServiceModule],
  providers: [TransferNativeService],
  exports: [TransferNativeService],
})
export class TransferNativeModule {}
