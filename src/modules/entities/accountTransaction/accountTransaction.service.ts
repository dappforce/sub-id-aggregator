import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTransaction } from './entities/accountTransaction.entity';
import { FindAccountTxHistoryArgs } from '../../apiGateway/gql/dto/input/findTransactionsHistory.input.dto';
import { FindTransactionsHistoryResponseDto } from '../../apiGateway/gql/dto/response/findTransactionsHistory.response.dto';
import { TransactionKind } from '../../../constants/common';
import { TransferNative } from '../transferNative/entities/transferNative.entity';
import { VoteNative } from '../voteNative/entities/voteNative.entity';
import { RewardNative } from '../rewardNative/entities/rewardNative.entity';
import { AccountService } from '../account/account.service';

type AccountTransactionNativeData<T extends TransactionKind> =
  T extends TransactionKind.TRANSFER_TO
    ? TransferNative
    : T extends TransactionKind.TRANSFER_FROM
    ? TransferNative
    : T extends TransactionKind.VOTE
    ? VoteNative
    : T extends TransactionKind.REWARD
    ? RewardNative
    : never;

@Injectable()
export class AccountTransactionService {
  constructor(
    @InjectRepository(AccountTransaction)
    public readonly accountTransactionRepository: Repository<AccountTransaction>,
    private accountService: AccountService,
  ) {}


  async getAccountTransaction(
    accountTxId: string,
  ): Promise<AccountTransaction | null> {
    if (accountTxId === null || !accountTxId)
      throw new Error(`AccountTransaction ID has unsupported value`);

    let accountTx = await this.accountTransactionRepository.findOne({
      where: { id: accountTxId },
    });

    return accountTx;
  }

  async findAccountTxHistory({
    publicKey,
    orderDirection,
    orderBy,
    pageSize,
    offset,
  }: FindAccountTxHistoryArgs): Promise<[AccountTransaction[], number]> {
    return await this.accountTransactionRepository.findAndCount({
      where: {
        account: { id: publicKey },
      },
      skip: offset,
      take: pageSize,
      order: { [orderBy]: orderDirection },
    });
  }
}
