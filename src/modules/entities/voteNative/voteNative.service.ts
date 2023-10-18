import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './entities/voteNative.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VoteNativeService {
  constructor(
    @InjectRepository(Account)
    public readonly accountRepository: Repository<Account>,
  ) {}

  async getOrCreateAccount(accountId: string): Promise<Account> {
    if (accountId === null || !accountId)
      throw new Error(`Account ID has unsupported value`);

    let account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (account) return account;

    account = new Account();
    account.id = accountId;

    await this.accountRepository.save(account);

    return account;
  }
}
