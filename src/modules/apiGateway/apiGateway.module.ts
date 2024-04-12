import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { ApiGatewayService } from './services/apiGateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CommonUtils } from '../../utils/commonUtils';
import { AccountTransactionService } from '../entities/accountTransaction/accountTransaction.service';
import { DataAggregatorService } from '../dataAggregator/services/dataAggregator.service';
import { AccountTransaction } from '../entities/accountTransaction/entities/accountTransaction.entity';
import { BlockchainService } from '../entities/blockchain/blockchain.service';
import { QueueProcessorModule } from '../queueProcessor/queueProcessor.module';
import { AccountService } from '../entities/account/account.service';
import { Account } from '../entities/account/entities/account.entity';
import { Blockchain } from '../entities/blockchain/entities/blockchain.entity';
import { Transaction } from '../entities/transaction/entities/transaction.entity';
import { TransactionsHistoryResolver } from './gql/transactionsHistory.resolver';
import { AccountAggregationFlowProducer } from '../queueProcessor/services/producers/accountAggregationFlow.producer';
import { SubIdAggregatorQueueName } from '../../constants/queues';
import { RestHealthcheckController } from './rest/healthcheck/restHealthcheck.controller';

@Module({
  imports: [
    DependencyServiceModule,
    TypeOrmModule.forFeature([
      AccountTransaction,
      Account,
      Blockchain,
      Transaction,
    ]),
    BullModule.registerQueue(
      {
        name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
      },
      {
        name: SubIdAggregatorQueueName.DATASOURCE_HANDLING,
      },
    ),
    QueueProcessorModule,
  ],
  providers: [
    ApiGatewayService,
    CommonUtils,
    AccountTransactionService,
    DataAggregatorService,
    BlockchainService,
    AccountService,
    TransactionsHistoryResolver,
    AccountAggregationFlowProducer,
  ],
  controllers: [RestHealthcheckController],
  exports: [ApiGatewayService],
})
export class ApiGatewayModule {}
