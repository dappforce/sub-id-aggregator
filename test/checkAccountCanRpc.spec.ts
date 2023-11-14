import { AppConfig, EnvModule } from '../src/config.module';
import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { transformAndValidateSync } from 'class-transformer-validator';
import { CryptoUtils } from '../src/utils/cryptoUtils';
import * as ethers from 'ethers';

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

  test('addressToHex should convert', async () => {
    const evmToHexResult = cryptoUtils.addressToHex(
      '0xe93685f3bBA03016F02bD1828BaDD6195988D950',
    );
    const ss58ToHexResult = cryptoUtils.addressToHex(
      '5DksjtJER6oLDWkWKCWcL3f1swPWeNNFsS9zHxa2rPa7LsH9',
    );
    const hexToHexResult = cryptoUtils.addressToHex(
      '0x4adf51a47b72795366d52285e329229c836ea7bbfe139dbe8fa0700c4f86fc56',
    );
    const isValidSubstrateAddress = cryptoUtils.isValidAddress(
      '5DksjtJER6oLDWkWKCWcL3f1swPWeNNFsS9zHxa2rPa7LsH9',
    );
    const isValidEvmAddress = cryptoUtils.isValidAddress(
      '0xe93685f3bBA03016F02bD1828BaDD6195988D950',
    );
    const isValidRandomAddress = cryptoUtils.isValidAddress('aaabbb');

    expect(evmToHexResult).toEqual(
      '0xe93685f3bba03016f02bd1828badd6195988d950',
    );
    expect(ss58ToHexResult).toEqual(
      '0x4adf51a47b72795366d52285e329229c836ea7bbfe139dbe8fa0700c4f86fc56',
    );
    expect(hexToHexResult).toEqual(
      '0x4adf51a47b72795366d52285e329229c836ea7bbfe139dbe8fa0700c4f86fc56',
    );

    expect(isValidSubstrateAddress).toEqual(true);
    expect(isValidEvmAddress).toEqual(true);
    expect(isValidRandomAddress).toEqual(false);
  });
});
