import { Injectable, NotFoundException } from '@nestjs/common';
import { Blockchain } from './entities/blockchain.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  blockchainDataSourceConfigs,
  BlockchainTag,
  supportedBlockchainDetails,
} from '../../../constants/blockchain';
import { AppConfig } from '../../../config.module';
import { DataSourceUtils } from '../../../utils/dataSources/dataSourceUtils';
import { NativeTransactionKind } from '../../../constants/common';

@Injectable()
export class BlockchainService {
  public readonly blockchainDataSourceConfigs = [];

  constructor(
    @InjectRepository(Blockchain)
    public readonly blockchainRepository: Repository<Blockchain>,
    private appConfig: AppConfig,
    private dataSourceUtils: DataSourceUtils,
  ) {
    this.setDataSourceEndpoints();
  }

  setDataSourceEndpoints() {
    for (const chainConfig of blockchainDataSourceConfigs) {
      const chainConfigUpdated = chainConfig;

      for (const eventName in chainConfig.events) {
        chainConfigUpdated.events[eventName] =
          this.dataSourceUtils.getQueryEndpoint(
            chainConfig.tag,
            eventName as NativeTransactionKind,
          );
      }
      this.blockchainDataSourceConfigs.push(chainConfigUpdated);
    }

    console.dir(this.blockchainDataSourceConfigs, { depth: null });
  }

  async getOrCreateBlockchain(blockchainId: string): Promise<Blockchain> {
    if (blockchainId === null || !blockchainId)
      throw new Error(`Account ID has unsupported value`);

    let account = await this.blockchainRepository.findOne({
      where: { id: blockchainId },
    });

    if (account) return account;

    account = new Blockchain();
    account.id = blockchainId;

    await this.blockchainRepository.save(account);

    return account;
  }

  async initSupportedBlockchains() {
    const chainsToSave = [];
    const existingBlockchainsMap = new Map<BlockchainTag, Blockchain>(
      (
        (await this.blockchainRepository.find({
          where: {},
        })) || []
      ).map((chain) => [chain.tag, chain]),
    );

    for (const supportedChainData of supportedBlockchainDetails) {
      let chainData = existingBlockchainsMap.get(supportedChainData.tag);

      if (!chainData) chainData = new Blockchain();

      chainData.tag = supportedChainData.tag;
      chainData.info = supportedChainData.info;
      chainData.text = supportedChainData.text;
      chainData.logo = supportedChainData.logo;
      chainData.decimal = supportedChainData.decimal;
      chainData.prefix = supportedChainData.prefix;
      chainData.symbols = supportedChainData.symbols;
      chainData.color = supportedChainData.color;

      chainsToSave.push(chainData);
    }

    await this.blockchainRepository.save(chainsToSave);
  }

  getByTag(tag: BlockchainTag) {
    return this.blockchainRepository.findOne({
      where: {
        tag,
      },
    });
  }
}
