import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { DataAggregatorService } from './services/dataAggregator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainService } from '../entities/blockchain/blockchain.service';
import { DatasourceHandlingProducer } from '../queueProcessor/services/producers/datasourceHandling.producer';
import { AccountService } from '../entities/account/account.service';
import { Account } from '../entities/account/entities/account.entity';
import { Blockchain } from '../entities/blockchain/entities/blockchain.entity';
import { AggregationHelper } from './services/aggregation.helper';
import { TransferNativeService } from '../entities/transferNative/transferNative.service';
import { TransactionService } from '../entities/transaction/transaction.service';
import { AccountTransactionService } from '../entities/accountTransaction/accountTransaction.service';
import { AccountTransaction } from '../entities/accountTransaction/entities/accountTransaction.entity';
import { TransferNative } from '../entities/transferNative/entities/transferNative.entity';
import { BullModule } from '@nestjs/bull';
import { SubIdAggregatorQueueName } from '../../constants/queues';
import { Transaction } from '../entities/transaction/entities/transaction.entity';
import { DatasourceChunksParallelHandlingProducer } from '../queueProcessor/services/producers/datasourceChunksParallelHandling.producer';
import { DataSourceUtils } from '../../utils/dataSources/dataSourceUtils';

@Module({
  imports: [
    DependencyServiceModule,
    TypeOrmModule.forFeature([
      Account,
      Blockchain,
      AccountTransaction,
      TransferNative,
      Transaction,
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
      },
    ),
  ],
  providers: [
    DataAggregatorService,
    BlockchainService,
    DatasourceHandlingProducer,
    DatasourceChunksParallelHandlingProducer,
    AccountService,
    AccountTransactionService,
    AggregationHelper,
    DataSourceUtils,
    TransferNativeService,
    TransactionService,
  ],
  exports: [DataAggregatorService],
})
export class DataAggregatorModule {}
