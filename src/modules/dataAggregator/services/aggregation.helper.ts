import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../../entities/blockchain/blockchain.service';
import { DatasourceHandlingProducer } from '../../queueProcessor/services/producers/datasourceHandling.producer';
import { CollectEventDataFromDataSourceInput } from '../../queueProcessor/dto/collectEventDataFromDataSource.input';
import { DataSourceUtils } from '../../../utils/dataSourceUtils';
import { TransferNativeService } from '../../entities/transferNative/transferNative.service';
import {
  GetTransfersByAccountQuery,
  Transfer as SquidTransfer,
  TransferDirection,
} from '../../../utils/graphQl/gsquidMain/gsquid-main-query';
import { TransferNative } from '../../entities/transferNative/entities/transferNative.entity';
import { Transaction } from '../../entities/transaction/entities/transaction.entity';
import { TransactionKind } from '../../../constants/common';
import { AccountTransaction } from '../../entities/accountTransaction/entities/accountTransaction.entity';
import { AccountService } from '../../entities/account/account.service';
import { TransactionService } from '../../entities/transaction/transaction.service';
import { AccountTransactionService } from '../../entities/accountTransaction/accountTransaction.service';
import { CollectEventDataHandlerResponse } from '../dto/collectEventDataHandler.response';
import crypto from 'node:crypto';
import { CommonUtils } from '../../../utils/commonUtils';

@Injectable()
export class AggregationHelper {
  constructor(
    private blockchainService: BlockchainService,
    private dataSourceUtils: DataSourceUtils,
    private transferNativeService: TransferNativeService,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private accountTransactionService: AccountTransactionService,
    private commonUtils: CommonUtils,
  ) {}

  async collectTransferEventData(
    inputData: CollectEventDataFromDataSourceInput,
  ): Promise<CollectEventDataHandlerResponse> {
    const responseBuffer: GetTransfersByAccountQuery['transfers'] = [];

    const runQuery = async (offset: number = 0) => {
      const currentOffset = offset;
      const resp = await this.dataSourceUtils.getTransfersByAccount({
        limit: pageSize,
        offset: currentOffset,
        publicKey: inputData.publicKey,
        blockNumber_gt: inputData.latestProcessedBlock,
        queryUrl: inputData.sourceUrl,
      });
      if (resp.transfers.length === 0) return;
      responseBuffer.push(...resp.transfers);

      await runQuery(currentOffset + pageSize);
    };

    const pageSize = 100;
    await runQuery();

    const nativeTransferBuffer = [];
    const transactionsBuffer = [];
    const accountTransactionsBuffer = [];

    const txAccount = await this.accountService.getOrCreateAccount(
      inputData.publicKey,
    );

    const blockchain = await this.blockchainService.getByTag(
      inputData.blockchainTag,
    );

    for (const transferData of responseBuffer) {
      const nativeTransferEntity = new TransferNative({
        id: transferData.id,
        blockNumber: transferData.transfer.blockNumber,
        extrinsicHash: transferData.transfer.extrinsicHash,
        timestamp: new Date(transferData.transfer.timestamp),
        amount: BigInt(transferData.transfer.amount),
        success: transferData.transfer.success,
        from: await this.accountService.getOrCreateAccount(
          transferData.transfer.from.publicKey,
        ),
        to: await this.accountService.getOrCreateAccount(
          transferData.transfer.to.publicKey,
        ),
      });
      const txKind =
        transferData.direction === TransferDirection.From
          ? TransactionKind.TRANSFER_FROM
          : TransactionKind.TRANSFER_TO;

      const transactionEntity = new Transaction({
        id: `${nativeTransferEntity.id}-${txKind}`,
        transferNative: nativeTransferEntity,
        txKind,
      });

      const accountTransaction = new AccountTransaction({
        id: `${this.commonUtils.getStringShortcut(inputData.publicKey)}-${
          transactionEntity.id
        }`,
        txKind: transactionEntity.txKind,
        account: txAccount,
        blockchainTag: inputData.blockchainTag,
        amount: nativeTransferEntity.amount,
        blockchain: blockchain,
        senderOrTargetPublicKey:
          transactionEntity.txKind === TransactionKind.TRANSFER_FROM
            ? nativeTransferEntity.to.id
            : nativeTransferEntity.from.id,
        timestamp: nativeTransferEntity.timestamp,
        success: nativeTransferEntity.success,
        transaction: transactionEntity,
      });

      nativeTransferBuffer.push(nativeTransferEntity);
      transactionsBuffer.push(transactionEntity);
      accountTransactionsBuffer.push(accountTransaction);
    }

    await this.transferNativeService.transferNativeRepository.save(
      nativeTransferBuffer,
    );
    await this.transactionService.transactionRepository.save(
      transactionsBuffer,
    );
    await this.accountTransactionService.accountTransactionRepository.save(
      accountTransactionsBuffer,
    );
    return {
      latestProcessedBlock:
        responseBuffer.length > 0
          ? responseBuffer[responseBuffer.length - 1].transfer.blockNumber
          : null,
      action: inputData.event,
      blockchainTag: inputData.blockchainTag,
    };
  }

  async collectVoteEventData(inputData: CollectEventDataFromDataSourceInput) {}

  async collectRewardEventData(
    inputData: CollectEventDataFromDataSourceInput,
  ) {}
}
