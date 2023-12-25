import { AppConfig, EnvModule } from '../src/config.module';
import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { transformAndValidateSync } from 'class-transformer-validator';
import { CryptoUtils } from '../src/utils/cryptoUtils';
import * as ethers from 'ethers';
import { DataSourceUtilsSubQuery } from '../src/utils/dataSources/dataSourceUtils.subQuery';
import { DataSourceUtils } from '../src/utils/dataSources/dataSourceUtils';
import { BlockchainTag } from '../src/constants/blockchain';

dotenv.config({ path: `${__dirname}/../.env.local` });

describe('Aggregator', () => {
  let cryptoUtils: CryptoUtils = null;
  let appConfig: AppConfig = null;
  let dataSourceUtils: DataSourceUtils = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfig,
        CryptoUtils,
        DataSourceUtils,
        {
          provide: AppConfig,
          useFactory: () => {
            return transformAndValidateSync(AppConfig, process.env);
          },
        },
      ],
    }).compile();

    appConfig = module.get<AppConfig>(AppConfig);
    cryptoUtils = module.get<CryptoUtils>(CryptoUtils);
    dataSourceUtils = module.get<DataSourceUtils>(DataSourceUtils);
  });

  test('fetch transfers history by address', async () => {
    const resp = await dataSourceUtils.getTransfersByAccount({
      blockchainTag: BlockchainTag.POLKADOT,
      limit: 100,
      offset: 0,
      // blockNumber_gt: 8556806,
      blockNumber_gt: 0,
      blockNumber_lt: null,
      // address: '15kZjoFoTv1EtrrjB7g9Looc4HRWNnaswqEZDSPtw8QmLB1Q',
      publicKey:
        '0xd22ab116cec40b31955995c0d03dcdd6b931aed6d91e1907304c671b0779e107',
      queryUrl: appConfig.DATA_SOURCE__SUBQUERY__POLKADOT__TRANSFER,
    });

    console.dir(resp, { depth: null });

    // expect(isValidRandomAddress).toEqual(false);
  }, 60000);
});
