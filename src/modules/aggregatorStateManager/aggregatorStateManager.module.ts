import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregatorState } from './entities/aggregatorState.entity';
import { AggregatorStateManagerService } from './aggregatorStateManager.service';
import { OneTimeJobsManagerService } from './oneTimeJobsManager.service';
import { AccountAggregationFlowProducer } from '../queueProcessor/services/producers/accountAggregationFlow.producer';
import { DatasourceChunksParallelHandlingProducer } from '../queueProcessor/services/producers/datasourceChunksParallelHandling.producer';
import { DatasourceHandlingProducer } from '../queueProcessor/services/producers/datasourceHandling.producer';
import { registerBullQueues } from '../../modulesConfig/bullModule.forRoot';

@Module({
  imports: [TypeOrmModule.forFeature([AggregatorState]), registerBullQueues()],
  providers: [
    AggregatorStateManagerService,
    OneTimeJobsManagerService,
    AccountAggregationFlowProducer,
    DatasourceChunksParallelHandlingProducer,
    DatasourceHandlingProducer,
  ],
  exports: [AggregatorStateManagerService, OneTimeJobsManagerService],
})
export class AggregatorStateManagerModule {}
