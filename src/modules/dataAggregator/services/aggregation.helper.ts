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
import {
  NativeTransactionKind,
  TransactionKind,
} from '../../../constants/common';
import { AccountTransaction } from '../../entities/accountTransaction/entities/accountTransaction.entity';
import { AccountService } from '../../entities/account/account.service';
import { TransactionService } from '../../entities/transaction/transaction.service';
import { AccountTransactionService } from '../../entities/accountTransaction/accountTransaction.service';
import { CollectEventDataHandlerResponse } from '../dto/collectEventDataHandler.response';
import crypto from 'node:crypto';
import { CommonUtils } from '../../../utils/commonUtils';
import { CollectEventDataChunkFromDataSourceInput } from '../../queueProcessor/dto/collectEventDataChunkFromDataSource.input';
import { BlockchainTag } from '../../../constants/blockchain';
import { CollectTransfersChunkHandlerResponseResponse } from '../dto/collectTransfersChunkHandlerResponse.response';

@Injectable()
export class AggregationHelper {
  private chunkBlocksWindow = 1_000_000;

  constructor(
    private blockchainService: BlockchainService,
    private dataSourceUtils: DataSourceUtils,
    private transferNativeService: TransferNativeService,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private accountTransactionService: AccountTransactionService,
    private commonUtils: CommonUtils,
    private datasourceHandlingProducer: DatasourceHandlingProducer,
  ) {}

  async collectTransferEventData(
    inputData: CollectEventDataFromDataSourceInput,
  ): Promise<CollectEventDataHandlerResponse> {
    const sourceSquidStatus =
      await this.dataSourceUtils.getMainGiantSquidStatus({
        queryUrl: inputData.sourceUrl,
      });

    let chunksRanges = [];

    if (inputData.latestProcessedBlock === 0) {
      const currentRequestBlocksWindow =
        sourceSquidStatus.squidStatus.height - inputData.latestProcessedBlock;

      console.log(
        'currentRequestBlocksWindow - ',
        inputData.blockchainTag,
        currentRequestBlocksWindow,
      );

      let index = 0;
      while (
        index <=
        Math.ceil(currentRequestBlocksWindow / this.chunkBlocksWindow) - 1
      ) {
        if (
          (index + 1) * this.chunkBlocksWindow >
          sourceSquidStatus.squidStatus.height
        ) {
          chunksRanges.push([index * this.chunkBlocksWindow, null]);
        } else if (
          (index + 1) * this.chunkBlocksWindow <
          sourceSquidStatus.squidStatus.height
        ) {
          chunksRanges.push([
            index * this.chunkBlocksWindow + 1,
            (index + 1) * this.chunkBlocksWindow,
          ]);
        }
        index++;
      }
    } else {
      chunksRanges.push([inputData.latestProcessedBlock, null]);
    }

    const aggregationChunkResults = await Promise.allSettled(
      chunksRanges.map((range) => {
        return this.datasourceHandlingProducer.enqueueAndWaitCollectTransferEventDataChunk(
          {
            blockchainTag: inputData.blockchainTag,
            event: inputData.event,
            publicKey: inputData.publicKey,
            sourceUrl: inputData.sourceUrl,
            chunkStartBlock: range[0],
            chunkEndBlock: range[1],
          },
        );
      }),
    );

    let lastBlock = 0;
    let totalFetchedData: GetTransfersByAccountQuery['transfers'] = [];
    for (const aggregationResult of aggregationChunkResults) {
      if (aggregationResult.status !== 'fulfilled') continue;
      totalFetchedData.push(
        ...aggregationResult.value.jobResult.fetchedChunkData,
      );
    }

    const nativeTransferBuffer = [];
    const transactionsBuffer = [];
    const accountTransactionsBuffer = [];

    const txAccount = await this.accountService.getOrCreateAccount(
      inputData.publicKey,
    );

    const blockchain = await this.blockchainService.getByTag(
      inputData.blockchainTag,
    );

    for (const transferData of totalFetchedData) {
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
        ownerPublicKey: txAccount.id,
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

      if (
        transferData.transfer.blockNumber &&
        lastBlock < transferData.transfer.blockNumber
      )
        lastBlock = transferData.transfer.blockNumber;
    }

    await this.transferNativeService.transferNativeRepository.save(
      nativeTransferBuffer,
      { chunk: 1000 },
    );
    await this.transactionService.transactionRepository.save(
      transactionsBuffer,
      { chunk: 1000 },
    );
    await this.accountTransactionService.accountTransactionRepository.save(
      accountTransactionsBuffer,
      { chunk: 1000 },
    );

    // for (const aggregationResult of aggregationChunkResults) {
    //   if (aggregationResult.status !== 'fulfilled') continue;
    //
    //   const jobResult: CollectEventDataHandlerResponse =
    //     aggregationResult.value.jobResult;
    //   if (jobResult.latestProcessedBlock === null) continue;
    //   if (lastBlock < jobResult.latestProcessedBlock)
    //     lastBlock = jobResult.latestProcessedBlock;
    // }

    return {
      latestProcessedBlock:
        lastBlock ||
        inputData.latestProcessedBlock ||
        sourceSquidStatus.squidStatus.height - 300,
      action: inputData.event,
      blockchainTag: inputData.blockchainTag,
    };
  }

  async collectTransferEventDataChunk(
    inputData: CollectEventDataChunkFromDataSourceInput,
  ): Promise<CollectTransfersChunkHandlerResponseResponse> {
    const responseBuffer: GetTransfersByAccountQuery['transfers'] = [];
    let index = 1;

    const runQuery = async (offset: number = 0) => {
      const currentOffset = offset;
      const resp = await this.dataSourceUtils.getTransfersByAccount({
        limit: pageSize,
        offset: currentOffset,
        publicKey: inputData.publicKey,
        blockNumber_gt: inputData.chunkStartBlock,
        blockNumber_lt: inputData.chunkEndBlock,
        queryUrl: inputData.sourceUrl,
      });
      if (resp.transfers.length === 0) return;
      responseBuffer.push(...resp.transfers);

      console.log(
        `runQuery :: ${inputData.blockchainTag} :: ${
          inputData.chunkStartBlock
        }/${inputData.chunkEndBlock} :: index ${index} :: offset ${
          currentOffset + pageSize
        }`,
      );
      index++;
      await runQuery(currentOffset + pageSize);
    };
    const pageSize = 1000;
    await runQuery();

    // const nativeTransferBuffer = [];
    // const transactionsBuffer = [];
    // const accountTransactionsBuffer = [];
    //
    // const txAccount = await this.accountService.getOrCreateAccount(
    //   inputData.publicKey,
    // );
    //
    // const blockchain = await this.blockchainService.getByTag(
    //   inputData.blockchainTag,
    // );

    // for (const transferData of responseBuffer) {
    //   const nativeTransferEntity = new TransferNative({
    //     id: transferData.id,
    //     blockNumber: transferData.transfer.blockNumber,
    //     extrinsicHash: transferData.transfer.extrinsicHash,
    //     timestamp: new Date(transferData.transfer.timestamp),
    //     amount: BigInt(transferData.transfer.amount),
    //     success: transferData.transfer.success,
    //     from: await this.accountService.getOrCreateAccount(
    //       transferData.transfer.from.publicKey,
    //     ),
    //     to: await this.accountService.getOrCreateAccount(
    //       transferData.transfer.to.publicKey,
    //     ),
    //   });
    //   const txKind =
    //     transferData.direction === TransferDirection.From
    //       ? TransactionKind.TRANSFER_FROM
    //       : TransactionKind.TRANSFER_TO;
    //
    //   const transactionEntity = new Transaction({
    //     id: `${nativeTransferEntity.id}-${txKind}`,
    //     transferNative: nativeTransferEntity,
    //     txKind,
    //   });
    //
    //   const accountTransaction = new AccountTransaction({
    //     id: `${this.commonUtils.getStringShortcut(inputData.publicKey)}-${
    //       transactionEntity.id
    //     }`,
    //     ownerPublicKey: txAccount.id,
    //     txKind: transactionEntity.txKind,
    //     account: txAccount,
    //     blockchainTag: inputData.blockchainTag,
    //     amount: nativeTransferEntity.amount,
    //     blockchain: blockchain,
    //     senderOrTargetPublicKey:
    //       transactionEntity.txKind === TransactionKind.TRANSFER_FROM
    //         ? nativeTransferEntity.to.id
    //         : nativeTransferEntity.from.id,
    //     timestamp: nativeTransferEntity.timestamp,
    //     success: nativeTransferEntity.success,
    //     transaction: transactionEntity,
    //   });
    //
    //   nativeTransferBuffer.push(nativeTransferEntity);
    //   transactionsBuffer.push(transactionEntity);
    //   accountTransactionsBuffer.push(accountTransaction);
    // }

    // await this.transferNativeService.transferNativeRepository.save(
    //   nativeTransferBuffer,
    //   { chunk: 1000 },
    // );
    // await this.transactionService.transactionRepository.save(
    //   transactionsBuffer,
    //   { chunk: 1000 },
    // );
    // await this.accountTransactionService.accountTransactionRepository.save(
    //   accountTransactionsBuffer,
    //   { chunk: 1000 },
    // );
    // return {
    //   latestProcessedBlock:
    //     responseBuffer.length > 0
    //       ? responseBuffer[responseBuffer.length - 1].transfer.blockNumber
    //       : null,
    //   action: inputData.event,
    //   blockchainTag: inputData.blockchainTag,
    // };
    return {
      fetchedChunkData: responseBuffer,
    };
  }

  async collectVoteEventData(inputData: CollectEventDataFromDataSourceInput) {}

  async collectRewardEventData(
    inputData: CollectEventDataFromDataSourceInput,
  ) {}
}
