import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { transformAndValidateSync } from 'class-transformer-validator';
import { IsEnum, IsNotEmpty } from 'class-validator';
import * as dotenv from 'dotenv';
import { Transform } from 'class-transformer';
import { DataSourceProviders } from './constants/common';

dotenv.config({ path: `${__dirname}/../.env.local` });

export class AppConfig {
  @IsNotEmpty()
  readonly AGGREGATOR_DB_HOST: string;

  @IsNotEmpty()
  readonly AGGREGATOR_DB_PORT: string;

  @IsNotEmpty()
  readonly AGGREGATOR_DB_USERNAME: string;

  @IsNotEmpty()
  readonly AGGREGATOR_DB_PASSWORD: string;

  @IsNotEmpty()
  readonly AGGREGATOR_DB_DATABASE: string;

  @IsNotEmpty()
  readonly AGGREGATOR_REDIS_HOST: string;

  @IsNotEmpty()
  readonly AGGREGATOR_REDIS_PREFIX: string;

  @IsNotEmpty()
  readonly AGGREGATOR_REDIS_PORT: string;

  @IsNotEmpty()
  readonly AGGREGATOR_REDIS_PASSWORD: string;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly AGGREGATOR_REDIS_ENABLE_SSL: boolean;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly AGGREGATOR_HISTORY_RENEW_INTERVAL_MS: number;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly AGGREGATOR_GS_MAIN_CHUNK_BLOCKS_SIZE: number;

  @IsNotEmpty()
  readonly NODE_ENV: string;

  /**
   * === DATA SOURCES ===
   */

  @IsNotEmpty()
  @Transform(({ value }) => ('' + value).toUpperCase())
  @IsEnum(DataSourceProviders)
  readonly DATA_SOURCE_PROVIDER_TRANSFER: DataSourceProviders;


  @IsNotEmpty()
  readonly DATA_SOURCE__SUBSQUID__POLKADOT__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBSQUID__KUSAMA__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBSQUID__MOONBEAM__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBSQUID__MOONRIVER__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBSQUID__ASTAR__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBQUERY__POLKADOT__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBQUERY__KUSAMA__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBQUERY__MOONBEAM__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBQUERY__MOONRIVER__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBQUERY__ASTAR__TRANSFER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE__SUBQUERY__SUBSOCIAL__TRANSFER: string;
}

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useFactory: () => {
        return transformAndValidateSync(AppConfig, process.env);
      },
    },
  ],
  exports: [AppConfig],
})
export class EnvModule {}
