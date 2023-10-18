import { Injectable, NotFoundException } from '@nestjs/common';
import { Blockchain } from './entities/blockchain.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BlockchainName,
  NativeTransactionKind,
} from '../../../constants/common';

export const supportedBlockchains = [
  {
    tag: BlockchainName.POLKADOT,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-polkadot/graphql',
      [NativeTransactionKind.REWARD]:
        'https://squid.subsquid.io/gs-main-polkadot/graphql',
    },
  },
  {
    tag: BlockchainName.KUSAMA,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-kusama/graphql',
      [NativeTransactionKind.REWARD]:
        'https://squid.subsquid.io/gs-main-kusama/graphql',
    },
  },
  {
    tag: BlockchainName.MOONBEAM,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-moonbeam/graphql',
      [NativeTransactionKind.REWARD]:
        'https://squid.subsquid.io/gs-main-moonbeam/graphql',
    },
  },
  {
    tag: BlockchainName.MOONRIVER,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-moonriver/graphql',
      [NativeTransactionKind.REWARD]:
        'https://squid.subsquid.io/gs-main-moonriver/graphql',
    },
  },
  {
    tag: BlockchainName.ASTAR,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-astar/graphql',
      [NativeTransactionKind.REWARD]:
        'https://squid.subsquid.io/gs-main-astar/graphql',
    },
  },
] as const;

@Injectable()
export class BlockchainService {
  public readonly supportedBlockchains = supportedBlockchains;

  constructor(
    @InjectRepository(Blockchain)
    public readonly blockchainRepository: Repository<Blockchain>,
  ) {}

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

  getByTag(tag: BlockchainName) {
    return this.blockchainRepository.findOne({
      where: {
        tag,
      },
    });
  }
}
