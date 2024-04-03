import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Redis } from 'ioredis';

import DbMigrations from '../migrations';
import { AppConfig } from '../../../config.module';

enum MigrationKey {
  DB_MIGRATIONS_ALL = 'db_migrations:all',
}

@Injectable()
export class RedisClientManagerService {
  public bullQueueRedisClient: Redis;
  public migrationsRedisClient: Redis;

  private dbSectionToClientRelations = {
    active_staking: 'statsRedisClient',
  };

  constructor(private appConfig: AppConfig) {
    this.initMigrationsRedisClient();
  }

  setBullQueueRedisClient(client: Redis) {
    this.bullQueueRedisClient = client;
  }

  initMigrationsRedisClient() {
    const client = new Redis({
      host: this.appConfig.AGGREGATOR_REDIS_HOST,
      port: +this.appConfig.AGGREGATOR_REDIS_PORT,
      password: this.appConfig.AGGREGATOR_REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      showFriendlyErrorStack: true,
      db: 1,
      keepAlive: 30_000,
      ...(this.appConfig.AGGREGATOR_REDIS_ENABLE_SSL
        ? { tls: {}, connectTimeout: 60_000 }
        : {}),

      retryStrategy: (times) => {
        if (times > 200) {
          console.log('Migrations :: Redis reconnect stopped. ');
          return null;
        }
        console.log('Migrations :: Redis connection retry -', times);
        const delay = Math.min(times * 1000, 2000);
        return delay;
      },
    });

    client.on('connect', () => {
      console.log('Migrations :: Redis client connect');
    });
    client.on('connecting', () => {
      console.log('Migrations :: Redis client connecting');
    });
    client.on('ready', () => {
      console.log('Migrations :: Redis client ready');
    });
    client.on('reconnecting', () => {
      console.log('Migrations :: Redis client reconnecting');
    });

    this.migrationsRedisClient = client;
  }

  async runRedisMigrations() {
    const migrationsMap = new Map(DbMigrations.map((item) => [item.id, item]));
    let migrationIdsToRun = [];
    const migrationsTableKey = await this.migrationsRedisClient.keys(
      MigrationKey.DB_MIGRATIONS_ALL,
    );

    if (!migrationsTableKey || migrationsTableKey.length === 0) {
      migrationIdsToRun = [...migrationsMap.keys()];
    } else {
      const executedMigrations = await this.migrationsRedisClient.smembers(
        MigrationKey.DB_MIGRATIONS_ALL,
      );

      for (const item of executedMigrations) {
        migrationsMap.delete(item);
      }
      migrationIdsToRun = [...migrationsMap.keys()];
    }

    if (!migrationIdsToRun || migrationIdsToRun.length === 0)
      console.log(`Redis DB :: No pending DB migrations found.`);

    for (const migrationId of migrationIdsToRun) {
      const migrationDetails = migrationsMap.get(migrationId);

      switch (migrationDetails.action) {
        // case 'WIPE': {
        //   await this.wipeKeys({
        //     client: this[this.dbSectionToClientRelations[migrationDetails.db]],
        //     pattern: migrationDetails.pattern,
        //   });
        //   await this.migrationsRedisClient.sadd(
        //     MigrationKey.DB_MIGRATIONS_ALL,
        //     migrationDetails.id,
        //   );
        //   console.log(
        //     `Redis DB :: DB migration has been completed with details: [id: ${migrationDetails.id} // action: ${migrationDetails.action}] // db: ${migrationDetails.db} // pattern: ${migrationDetails.pattern}`,
        //   );
        //   break;
        // }
        // case 'WIPE_WITH_RANGE': {
        //   await this.wipeKeys({
        //     client: this[this.dbSectionToClientRelations[migrationDetails.db]],
        //     pattern: migrationDetails.pattern,
        //     // @ts-ignore
        //     rangeFrom: migrationDetails.range.from,
        //     // @ts-ignore
        //     rangeTo: migrationDetails.range.to,
        //   });
        //   await this.migrationsRedisClient.sadd(
        //     MigrationKey.DB_MIGRATIONS_ALL,
        //     migrationDetails.id,
        //   );
        //   console.log(
        //     `Redis DB :: DB migration has been completed with details: [id: ${migrationDetails.id} // action: ${migrationDetails.action}] // db: ${migrationDetails.db} // pattern: ${migrationDetails.pattern}`,
        //   );
        //   break;
        // }
        case 'BGREWRITEAOF': {
          try {
            await this.migrationsRedisClient.bgrewriteaof((err, result) => {
              console.log('bgrewriteaof');
              console.log('err :: ', err);
              console.log('result :: ', result);
            });
          } catch (e) {
            console.log(e);
          }

          await this.migrationsRedisClient.sadd(
            MigrationKey.DB_MIGRATIONS_ALL,
            migrationDetails.id,
          );
          console.log(
            `Redis DB :: DB migration has been completed with details: [id: ${migrationDetails.id} // action: ${migrationDetails.action}]`,
          );
          break;
        }
        default:
      }
    }
  }

  // async wipeKeys({
  //   client,
  //   pattern,
  //   rangeFrom,
  //   rangeTo,
  // }: {
  //   client: Redis;
  //   pattern: string;
  //   rangeFrom?: number;
  //   rangeTo?: number;
  // }) {
  //   const keysToDelete = await this.findKeysByPattern(pattern, client);
  //
  //   console.log('keysToDelete-  ', keysToDelete);
  //
  //   if (!rangeFrom && !rangeTo && keysToDelete.length > 0) {
  //     await client.del(keysToDelete);
  //     return;
  //   }
  //
  //   const keysToDeleteInRange: string[] = [];
  //   const patternDecorated = pattern.replace(':*', ':');
  //
  //   for (const key of keysToDelete) {
  //     console.log(key);
  //     const keyRangeCursor = parseInt(key.replace(patternDecorated, ''));
  //     console.log('keyRangeCursor - ', keyRangeCursor);
  //     if (Number.isNaN(keyRangeCursor)) continue;
  //
  //     if (
  //       (!rangeFrom && rangeTo && keyRangeCursor < rangeTo) ||
  //       (rangeFrom &&
  //         rangeTo &&
  //         keyRangeCursor < rangeTo &&
  //         keyRangeCursor > rangeFrom) ||
  //       (rangeFrom && !rangeTo && keyRangeCursor > rangeFrom)
  //     )
  //       keysToDeleteInRange.push(key);
  //   }
  //
  //   console.log('keysToDeleteInRange - ', keysToDeleteInRange);
  //
  //   if (keysToDeleteInRange && keysToDeleteInRange.length > 0)
  //     await client.del(keysToDeleteInRange);
  //
  //   // let cursor = '0';
  //   //
  //   // do {
  //   //   const reply = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
  //   //   cursor = reply[0];
  //   //   const keys = reply[1];
  //   //
  //   //   if (keys.length > 0) {
  //   //     await client.del(...keys);
  //   //   }
  //   // } while (cursor !== '0');
  // }
}
