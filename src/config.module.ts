import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { transformAndValidateSync } from 'class-transformer-validator';
import { IsNotEmpty } from 'class-validator';
import * as dotenv from 'dotenv';
import { Transform } from 'class-transformer';

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

  @IsNotEmpty()
  readonly DATA_SOURCE_GSQUID_MAIN_POLKADOT: string;

  @IsNotEmpty()
  readonly DATA_SOURCE_GSQUID_MAIN_KUSAMA: string;

  @IsNotEmpty()
  readonly DATA_SOURCE_GSQUID_MAIN_MOONBEAM: string;

  @IsNotEmpty()
  readonly DATA_SOURCE_GSQUID_MAIN_MOONRIVER: string;

  @IsNotEmpty()
  readonly DATA_SOURCE_GSQUID_MAIN_ASTAR: string;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly AGGREGATOR_HISTORY_RENEW_INTERVAL_MS: number;


  @IsNotEmpty()
  readonly NODE_ENV: string;
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
