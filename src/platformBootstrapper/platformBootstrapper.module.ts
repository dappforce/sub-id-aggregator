import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependencyServiceModule } from '../dependencyServiceModule.module';
import { CommonBootstrapperService } from './common.bootstrapper.service';
import { Blockchain } from '../modules/entities/blockchain/entities/blockchain.entity';
import { BlockchainService } from '../modules/entities/blockchain/blockchain.service';
import { OneTimeJobsManagerService } from '../modules/aggregatorStateManager/oneTimeJobsManager.service';
import { AggregatorStateManagerService } from 'src/modules/aggregatorStateManager/aggregatorStateManager.service';
import { AccountAggregationFlowProducer } from '../modules/queueProcessor/services/producers/accountAggregationFlow.producer';
import { DatasourceChunksParallelHandlingProducer } from '../modules/queueProcessor/services/producers/datasourceChunksParallelHandling.producer';
import { DatasourceHandlingProducer } from '../modules/queueProcessor/services/producers/datasourceHandling.producer';
import { AggregatorState } from '../modules/aggregatorStateManager/entities/aggregatorState.entity';
import { registerBullQueues } from '../modulesConfig/bullModule.forRoot';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blockchain, AggregatorState]),
    DependencyServiceModule,
    registerBullQueues(),
  ],
  providers: [
    CommonBootstrapperService,
    BlockchainService,
    OneTimeJobsManagerService,
    AggregatorStateManagerService,
    AccountAggregationFlowProducer,
    DatasourceChunksParallelHandlingProducer,
    DatasourceHandlingProducer,
  ],
})
export class PlatformBootstrapperModule {}
