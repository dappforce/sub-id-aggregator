import { AppConfig, EnvModule } from '../src/config.module';
import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { transformAndValidateSync } from 'class-transformer-validator';
import { CryptoUtils } from '../src/utils/cryptoUtils';

dotenv.config({ path: `${__dirname}/../.env.local` });

describe('Check CryptoUtils service', () => {
  let cryptoUtils: CryptoUtils = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoUtils,
        {
          provide: AppConfig,
          useFactory: () => {
            return transformAndValidateSync(AppConfig, process.env);
          },
        },
      ],
    }).compile();

    cryptoUtils = module.get<CryptoUtils>(CryptoUtils);
  });

  test('substrateAddressToHex should convert', async () => {
    const ss58ToHexResult = await cryptoUtils.substrateAddressToHex(
      '5DksjtJER6oLDWkWKCWcL3f1swPWeNNFsS9zHxa2rPa7LsH9',
    );
    const hexToHexResult = await cryptoUtils.substrateAddressToHex(
      '0x4adf51a47b72795366d52285e329229c836ea7bbfe139dbe8fa0700c4f86fc56',
    );

    expect(
      '0x4adf51a47b72795366d52285e329229c836ea7bbfe139dbe8fa0700c4f86fc56',
    ).toEqual(ss58ToHexResult);
    expect(
      '0x4adf51a47b72795366d52285e329229c836ea7bbfe139dbe8fa0700c4f86fc56',
    ).toEqual(hexToHexResult);
  });
});
