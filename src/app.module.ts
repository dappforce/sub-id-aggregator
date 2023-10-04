import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { DependencyServiceModule } from './dependencyServiceModule.module';
import './common/entities/enums';
import { AppConfig, EnvModule } from './config.module';
import GraphQLJSON from 'graphql-type-json';
import { BullModule } from '@nestjs/bull';
import { QueueProcessorModule } from './modules/queueProcessor/queueProcessor.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { DataAggregatorModule } from './modules/dataAggregator/dataAggregator.module';
import { ApiGatewayModule } from './modules/apiGateway/apiGateway.module';
import { GraphQLBigInt } from 'graphql-scalars';

dotenv.config();

@Module({
  imports: [
    EnvModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: './schema.gql',
      path: '/graphql',
      playground: true,
      driver: ApolloDriver,
      resolvers: { BigInt: GraphQLBigInt },
      // resolvers: { JSON: GraphQLJSON },
    }),
    BullModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        redis: {
          host: config.AGGREGATOR_REDIS_HOST,
          port: +config.AGGREGATOR_REDIS_PORT,
          password: config.REDIS_QUEUE_PASSWORD,
        },
        prefix: config.AGGREGATOR_REDIS_PREFIX,
        // https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queue
        settings: {
          lockDuration: 20000, // Check for stalled jobs each 2 min
          lockRenewTime: 10000,
          stalledInterval: 2000,
          maxStalledCount: 100,
        },
      }),
    }),
    // https://til.selleo.com/posts/826-bull-board-for-nestjs
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),

    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
        return {
          keepConnectionAlive: true,
          type: 'postgres',
          host: config.AGGREGATOR_DB_HOST,
          port: +config.AGGREGATOR_DB_PORT,
          username: config.AGGREGATOR_DB_USERNAME,
          password: config.AGGREGATOR_DB_PASSWORD,
          database: config.AGGREGATOR_DB_DATABASE,
          autoLoadEntities: true,
          synchronize: true,
          entities: [],
        };
      },
    }),

    DependencyServiceModule,
    QueueProcessorModule,
    ApiGatewayModule,
    DataAggregatorModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(ApiToggleMiddleware).forRoutes('*');
  }
}
