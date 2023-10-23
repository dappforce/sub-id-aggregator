import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Account,
  AccountLatestProcessedBlockMap,
} from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockchainService } from '../blockchain/blockchain.service';
import {
  NativeTransactionKind,
} from '../../../constants/common';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    public readonly accountRepository: Repository<Account>,
    public blockchainService: BlockchainService,
  ) {}

  async getOrCreateAccount(accountId: string): Promise<Account> {
    if (accountId === null || !accountId)
      throw new Error(`Account ID has unsupported value`);

    let account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (account) return account;

    let latestProcessedBlock: AccountLatestProcessedBlockMap | {} = {};

    for (const blockchainData of this.blockchainService.blockchainDataSourceConfigs) {
      latestProcessedBlock[blockchainData.tag] = Object.fromEntries(
        Object.keys(blockchainData.events).map(
          // @ts-ignore
          (key: NativeTransactionKind) => [key, 0],
        ),
      );
    }

    account = new Account();
    account.id = accountId;
    account.latestProcessedBlock =
      latestProcessedBlock as AccountLatestProcessedBlockMap;

    await this.accountRepository.save(account);

    return account;
  }
}
