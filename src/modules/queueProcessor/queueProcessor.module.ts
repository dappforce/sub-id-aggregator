import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { AccountAggregationFlowConsumer } from './services/consumers/accountAggregationFlow.consumer';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule, BullBoardServerAdapter } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { SubIdAggregatorQueueName } from '../../constants/queues';
import { DatasourceHandlingProducer } from './services/producers/datasourceHandling.producer';
import { DataAggregatorService } from '../dataAggregator/services/dataAggregator.service';
import { BlockchainService } from '../entities/blockchain/blockchain.service';
import { AccountService } from '../entities/account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTransaction } from '../entities/accountTransaction/entities/accountTransaction.entity';
import { Account } from '../entities/account/entities/account.entity';
import { Blockchain } from '../entities/blockchain/entities/blockchain.entity';

@Module({
  imports: [
    DependencyServiceModule,
    TypeOrmModule.forFeature([Account, Blockchain]),
    BullModule.registerQueue(
      {
        name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
      },
      {
        name: SubIdAggregatorQueueName.DATASOURCE_HANDLING,
      },
    ),
    BullBoardModule.forFeature(
      {
        name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
        adapter: BullAdapter,
      },
      {
        name: SubIdAggregatorQueueName.DATASOURCE_HANDLING,
        adapter: BullAdapter,
      },
    ),
  ],
  providers: [
    AccountAggregationFlowConsumer,
    DatasourceHandlingProducer,
    DataAggregatorService,
    BlockchainService,
    AccountService,
  ],
  exports: [AccountAggregationFlowConsumer, DatasourceHandlingProducer],
})
export class QueueProcessorModule {}
