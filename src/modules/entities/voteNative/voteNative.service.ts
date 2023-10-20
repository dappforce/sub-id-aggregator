import { Injectable, NotFoundException } from '@nestjs/common';
import { VoteNative } from './entities/voteNative.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VoteNativeService {
  constructor(
    @InjectRepository(VoteNative)
    public readonly voteNativeRepository: Repository<VoteNative>,
  ) {}

  async getVoteNative(voteId: string): Promise<VoteNative> {
    if (voteId === null || !voteId)
      throw new Error(`Vote ID has unsupported value`);

    return this.voteNativeRepository.findOne({
      where: { id: voteId },
    });
  }

  // async createVoteNative(voteId: string): Promise<Account> {
  //   if (accountId === null || !accountId)
  //     throw new Error(`Account ID has unsupported value`);
  //
  //   let account = await this.voteNativeRepository.findOne({
  //     where: { id: accountId },
  //   });
  //
  //   if (account) return account;
  //
  //   account = new Account();
  //   account.id = accountId;
  //
  //   await this.accountRepository.save(account);
  //
  //   return account;
  // }
}
