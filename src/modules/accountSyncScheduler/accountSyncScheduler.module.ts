import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { BullModule } from '@nestjs/bull';
import { SubIdAggregatorQueueName } from '../../constants/queues';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountSyncSchedulerService } from './accountSyncScheduler.service';
import { HistoryUpdateSubscription } from './entities/historyUpdateSubscription.entity';
import { AccountService } from '../entities/account/account.service';
import { Account } from '../entities/account/entities/account.entity';
import { AccountAggregationFlowProducer } from '../queueProcessor/services/producers/accountAggregationFlow.producer';
import { Blockchain } from '../entities/blockchain/entities/blockchain.entity';
import { BlockchainService } from '../entities/blockchain/blockchain.service';

@Module({
  imports: [
    DependencyServiceModule,
    TypeOrmModule.forFeature([HistoryUpdateSubscription, Account, Blockchain]),
    BullModule.registerQueue(
      {
        name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
      },
      {
        name: SubIdAggregatorQueueName.DATASOURCE_HANDLING,
      },
    ),
  ],
  providers: [
    AccountSyncSchedulerService,
    AccountService,
    BlockchainService,
    AccountAggregationFlowProducer,
  ],
  exports: [AccountSyncSchedulerService],
})
export class AccountSyncSchedulerModule {}
