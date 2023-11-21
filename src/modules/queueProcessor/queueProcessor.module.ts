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
import { AccountAggregationFlowProducer } from './services/producers/accountAggregationFlow.producer';
import { DatasourceHandlingConsumer } from './services/consumers/datasourceHandling.consumer';
import { AggregationHelper } from '../dataAggregator/services/aggregation.helper';
import { TransferNativeService } from '../entities/transferNative/transferNative.service';
import { TransferNative } from '../entities/transferNative/entities/transferNative.entity';
import { TransactionService } from '../entities/transaction/transaction.service';
import { AccountTransactionService } from '../entities/accountTransaction/accountTransaction.service';
import { Transaction } from '../entities/transaction/entities/transaction.entity';
import { AccountSyncSchedulerService } from '../accountSyncScheduler/accountSyncScheduler.service';
import { HistoryUpdateSubscription } from '../accountSyncScheduler/entities/historyUpdateSubscription.entity';
import { DatasourceChunksParallelHandlingProducer } from './services/producers/datasourceChunksParallelHandling.producer';
import { join } from 'path';
import { DatasourceChunkParallelHandlingConsumer } from './services/consumers/datasourceChunkParallelHandling.consumer';

@Module({
  imports: [
    DependencyServiceModule,
    TypeOrmModule.forFeature([
      Account,
      Blockchain,
      TransferNative,
      Transaction,
      AccountTransaction,
      HistoryUpdateSubscription,
    ]),
    BullModule.registerQueue(
      {
        name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
      },
      {
        name: SubIdAggregatorQueueName.DATASOURCE_HANDLING,
      },
      {
        name: SubIdAggregatorQueueName.DATASOURCE_CHUNKS_PARALLEL_HANDLING,
        processors: [
          {
            concurrency: 5,
            name: 'TRANSFER_CHUNK',
            path: join(
              __dirname,
              'services/workers/collectTransfersDataChunk.worker.js',
            ),
          },
        ],
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
      {
        name: SubIdAggregatorQueueName.DATASOURCE_CHUNKS_PARALLEL_HANDLING,
        adapter: BullAdapter,
      },
    ),
  ],
  providers: [
    AccountAggregationFlowConsumer,
    DatasourceHandlingConsumer,
    DatasourceChunkParallelHandlingConsumer,
    DatasourceHandlingProducer,
    AccountAggregationFlowProducer,
    DatasourceChunksParallelHandlingProducer,
    DataAggregatorService,
    BlockchainService,
    AccountService,
    AggregationHelper,
    TransferNativeService,
    TransactionService,
    AccountTransactionService,
    AccountSyncSchedulerService,
  ],
  exports: [AccountAggregationFlowConsumer, DatasourceHandlingProducer],
})
export class QueueProcessorModule {}
