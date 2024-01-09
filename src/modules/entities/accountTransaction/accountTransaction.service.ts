import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AccountTransaction } from './entities/accountTransaction.entity';
import { FindAccountTxHistoryArgs } from '../../apiGateway/gql/dto/input/findTransactionsHistory.input.dto';
import { FindTransactionsHistoryResponseDto } from '../../apiGateway/gql/dto/response/findTransactionsHistory.response.dto';
import { TransactionKind } from '../../../constants/common';
import { TransferNative } from '../transferNative/entities/transferNative.entity';
import { VoteNative } from '../voteNative/entities/voteNative.entity';
import { RewardNative } from '../rewardNative/entities/rewardNative.entity';
import { AccountService } from '../account/account.service';
import { CryptoUtils } from '../../../utils/cryptoUtils';

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
    private cryptoUtils: CryptoUtils,
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
    where: { publicKey, blockchainTag, txKind },
    orderDirection,
    orderBy,
    pageSize,
    offset,
  }: FindAccountTxHistoryArgs): Promise<[AccountTransaction[], number]> {
    return this.accountTransactionRepository.findAndCount({
      where: {
        ownerPublicKey: this.cryptoUtils.addressToHexIfNotHex(publicKey),
        ...(blockchainTag ? { blockchainTag: In(blockchainTag) } : {}),
        ...(txKind ? { txKind: In(txKind) } : {}),
      },
      relations: {
        account: true,
        blockchain: true,
        transaction: {
          transferNative: {
            from: true,
            to: true,
          },
          voteNative: true,
          rewardNative: true,
        },
      },
      skip: offset,
      take: pageSize,
      order: { [orderBy]: orderDirection },
    });
  }
}
