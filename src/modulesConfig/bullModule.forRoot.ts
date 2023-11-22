import { AppConfig } from '../config.module';
import { Redis } from 'ioredis';
import { SharedBullAsyncConfiguration } from '@nestjs/bull/dist/interfaces';

export default {
  inject: [AppConfig],
  useFactory: (config: AppConfig) => {

    console.log('config.AGGREGATOR_REDIS_HOST - ', config.AGGREGATOR_REDIS_HOST)
    console.log('config.AGGREGATOR_REDIS_PORT - ', config.AGGREGATOR_REDIS_PORT)
    console.log('config.AGGREGATOR_REDIS_PASSWORD - ', config.AGGREGATOR_REDIS_PASSWORD)
    console.log('config.AGGREGATOR_REDIS_PREFIX - ', config.AGGREGATOR_REDIS_PREFIX)


    const getClient = () => {
      const client = new Redis({
        host: config.AGGREGATOR_REDIS_HOST,
        port: +config.AGGREGATOR_REDIS_PORT,
        password: config.AGGREGATOR_REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        showFriendlyErrorStack: true,
        keepAlive: 30_000,
        ...(config.AGGREGATOR_REDIS_ENABLE_SSL
          ? { tls: {}, connectTimeout: 60_000 }
          : {}),

        retryStrategy: (times) => {
          if (times > 100) {
            console.log('Redis reconnect stopped. ');
            return null;
          }
          console.log('Redis connection retry -', times);
          const delay = Math.min(times * 1000, 2000);
          return delay;
        },
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
        stalledInterval: 5 * 60 * 1000,
        maxStalledCount: 1,
      },
    };
  },
} as SharedBullAsyncConfiguration;
