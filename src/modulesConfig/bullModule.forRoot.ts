import { AppConfig } from '../config.module';
import { Redis } from 'ioredis';
import { SharedBullAsyncConfiguration } from '@nestjs/bull/dist/interfaces';

export default {
  inject: [AppConfig],
  useFactory: (config: AppConfig) => {
    const getClient = () => {
      const client = new Redis({
        host: config.AGGREGATOR_REDIS_HOST,
        port: +config.AGGREGATOR_REDIS_PORT,
        password: config.AGGREGATOR_REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        showFriendlyErrorStack: true,
        ...(config.NODE_ENV === 'production'
          ? { tls: {}, connectTimeout: 40000 }
          : {}),

        retryStrategy: (times) => {
          if (times > 100) {
            console.log('Redis reconnect stopped. ');
            return null;
          }
          console.log('Redis connection retry -', times);
          const delay = Math.min(times * 1000, 2000);
          return delay;
        }
      });

      console.log('Redis client isCluster - ', client.isCluster);
      console.log('Redis client mode - ', client.mode);
      client.on('connect', () => {
        console.log('Redis client connect');
      });
      client.on('connecting', () => {
        console.log('Redis client connecting');
      });
      client.on('ready', () => {
        console.log('Redis client ready');
      });
      client.on('reconnecting', () => {
        console.log('Redis client reconnecting');
      });

      return client;
    };

    const client = getClient();

    return {
      createClient: (type) => {
        switch (type) {
          case 'client':
            return client;
          default:
            return getClient();
        }
      },
      prefix: config.AGGREGATOR_REDIS_PREFIX,
      // https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queue
      settings: {
        lockDuration: 20000, // Check for stalled jobs each 2 min
        lockRenewTime: 10000,
        stalledInterval: 2000,
        maxStalledCount: 100
      }
    };
  }
} as SharedBullAsyncConfiguration;
