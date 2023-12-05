import { Injectable, NotFoundException } from '@nestjs/common';
import { RewardNative } from './entities/rewardNative.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RewardNativeService {
  constructor(
    @InjectRepository(RewardNative)
    public readonly rewardRepository: Repository<RewardNative>,
  ) {}

  async getRewardNative(id: string): Promise<RewardNative> {
    if (id === null || !id) throw new Error(`Reward ID has unsupported value`);

    return this.rewardRepository.findOne({
      where: { id },
    });

    // if (account) return account;
    //
    // account = new Account();
    // account.id = accountId;
    //
    // await this.accountRepository.save(account);
    //
    // return account;
  }
}
