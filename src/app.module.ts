import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { DependencyServiceModule } from './dependencyServiceModule.module';
import './common/entities/enums';
import { EnvModule } from './config.module';
import { BullModule } from '@nestjs/bull';
import { QueueProcessorModule } from './modules/queueProcessor/queueProcessor.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { DataAggregatorModule } from './modules/dataAggregator/dataAggregator.module';
import { ApiGatewayModule } from './modules/apiGateway/apiGateway.module';
import { AccountModule } from './modules/entities/account/account.module';
import { AccountTransactionModule } from './modules/entities/accountTransaction/accountTransaction.module';
import { BlockchainModule } from './modules/entities/blockchain/blockchain.module';
import { RewardNativeModule } from './modules/entities/rewardNative/rewardNative.module';
import { TransactionModule } from './modules/entities/transaction/transaction.module';
import { TransferNativeModule } from './modules/entities/transferNative/transferNative.module';
import { VoteNativeModule } from './modules/entities/voteNative/voteNative.module';
import config from './modulesConfig';
import { PlatformBootstrapperModule } from './platformBootstrapper/platformBootstrapper.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountSyncSchedulerModule } from './modules/accountSyncScheduler/accountSyncScheduler.module';
import { AggregatorStateManagerModule } from './modules/aggregatorStateManager/aggregatorStateManager.module';

dotenv.config();

@Module({
  imports: [
    EnvModule,
    GraphQLModule.forRoot<ApolloDriverConfig>(config.graphqlModuleForRoot),
    BullModule.forRootAsync(config.bullModuleForRoot),
    // https://til.selleo.com/posts/826-bull-board-for-nestjs
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    TypeOrmModule.forRootAsync(config.typeOrmModuleForRoot),
    ScheduleModule.forRoot(),
    DependencyServiceModule,
    QueueProcessorModule,
    ApiGatewayModule,
    DataAggregatorModule,
    AccountModule,
    AccountTransactionModule,
    BlockchainModule,
    RewardNativeModule,
    TransactionModule,
    TransferNativeModule,
    VoteNativeModule,
    PlatformBootstrapperModule,
    AccountSyncSchedulerModule,
    AggregatorStateManagerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(ApiToggleMiddleware).forRoutes('*');
  }
}
