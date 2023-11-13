import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { AppConfig } from '../config.module';
import { Account } from '../modules/entities/account/entities/account.entity';
import { AccountTransaction } from '../modules/entities/accountTransaction/entities/accountTransaction.entity';
import { Blockchain } from '../modules/entities/blockchain/entities/blockchain.entity';
import { RewardNative } from '../modules/entities/rewardNative/entities/rewardNative.entity';
import { Transaction } from '../modules/entities/transaction/entities/transaction.entity';
import { TransferNative } from '../modules/entities/transferNative/entities/transferNative.entity';
import { VoteNative } from '../modules/entities/voteNative/entities/voteNative.entity';

export default {
  inject: [AppConfig],
  useFactory: (config: AppConfig) => {
    return {
      ssl:
        config.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      extra: {
        max: 20,
        connectionTimeoutMillis: 2000,
        idleTimeoutMillis: 60000,
        ssl:
          config.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      },
      poolErrorHandler: (e) => {
        console.log('PG pool Error ', e);
      },
      // logging: 'all',
      logNotifications: true,
      keepConnectionAlive: true,
      type: 'postgres',
      host: config.AGGREGATOR_DB_HOST,
      port: +config.AGGREGATOR_DB_PORT,
      username: config.AGGREGATOR_DB_USERNAME,
      password: config.AGGREGATOR_DB_PASSWORD,
      database: config.AGGREGATOR_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        AccountTransaction,
        Account,
        Blockchain,
        RewardNative,
        Transaction,
        TransferNative,
        VoteNative,
      ],
    };
  },
} as TypeOrmModuleAsyncOptions;
