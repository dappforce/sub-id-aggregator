import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../../entities/blockchain/blockchain.service';
import { DatasourceHandlingProducer } from '../../queueProcessor/services/producers/datasourceHandling.producer';
import { CollectEventDataFromDataSourceInput } from '../../queueProcessor/dto/collectEventDataFromDataSource.input';
import { TransferNativeService } from '../../entities/transferNative/transferNative.service';
import { TransferNative } from '../../entities/transferNative/entities/transferNative.entity';
import { Transaction } from '../../entities/transaction/entities/transaction.entity';
import {
  NativeTransactionKind,
  TransactionKind,
  TransferDirection,
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
import { AppConfig } from '../../../config.module';
import { DatasourceChunksParallelHandlingProducer } from '../../queueProcessor/services/producers/datasourceChunksParallelHandling.producer';
import { DataSourceUtils } from '../../../utils/dataSources/dataSourceUtils';
import { TransferDecoratedDto } from '../dto/transfersByAccountDecorated.dto';

@Injectable()
export class AggregationHelper {
  private readonly chunkBlocksWindow: number;

  constructor(
    private blockchainService: BlockchainService,
    private dataSourceUtils: DataSourceUtils,
    private transferNativeService: TransferNativeService,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private accountTransactionService: AccountTransactionService,
    private commonUtils: CommonUtils,
    private appConfig: AppConfig,
    private datasourceHandlingProducer: DatasourceHandlingProducer,
    private datasourceChunksParallelHandlingProducer: DatasourceChunksParallelHandlingProducer,
  ) {
    this.chunkBlocksWindow = appConfig.AGGREGATOR_GS_MAIN_CHUNK_BLOCKS_SIZE;
  }

  getChunksRanges({
    latestProcessedBlock,
    totalBlocks,
  }: {
    latestProcessedBlock: number;
    totalBlocks: number;
  }): [number, number | null][] {
    let chunksRanges = [];

    if (latestProcessedBlock === 0) {
      const currentRequestBlocksWindow = totalBlocks - latestProcessedBlock;

      let index = 0;
      while (
        index <=
        Math.ceil(currentRequestBlocksWindow / this.chunkBlocksWindow) - 1
      ) {
        if ((index + 1) * this.chunkBlocksWindow > totalBlocks) {
          chunksRanges.push([index * this.chunkBlocksWindow, null]);
        } else if ((index + 1) * this.chunkBlocksWindow < totalBlocks) {
          chunksRanges.push([
            index * this.chunkBlocksWindow + 1,
            (index + 1) * this.chunkBlocksWindow,
          ]);
        }
        index++;
      }
    } else {
      chunksRanges.push([latestProcessedBlock, null]);
    }

    return chunksRanges;
  }

  async collectTransferEventData(
    inputData: CollectEventDataFromDataSourceInput,
  ): Promise<CollectEventDataHandlerResponse> {
    const sourceIndexerStatus =
      await this.dataSourceUtils.getIndexerLastProcessedHeight({
        queryUrl: inputData.sourceUrl,
      });

    console.log(
      `${inputData.blockchainTag} indexer height - ${sourceIndexerStatus.height}`,
    );

    let chunksRanges = this.getChunksRanges({
      latestProcessedBlock: inputData.latestProcessedBlock,
      totalBlocks: sourceIndexerStatus.height,
    });

    const aggregationChunkResults = await Promise.allSettled(
      chunksRanges.map((range) => {
        return this.datasourceChunksParallelHandlingProducer.enqueueAndWaitCollectTransferEventDataChunkJobProducer(
          {
            blockchainTag: inputData.blockchainTag,
            event: inputData.event,
            publicKey: inputData.publicKey,
            sourceUrl: inputData.sourceUrl,
            chunkStartBlock: range[0],
            chunkEndBlock: range[1],
            onDemand: inputData.onDemand,
          },
        );
      }),
    );

    let lastBlock = 0;
    let totalFetchedData: TransferDecoratedDto[] = [];
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
        id: transferData.transfer.id,
        blockNumber: transferData.transfer.blockNumber,
        extrinsicHash: transferData.transfer.extrinsicHash,
        eventIndex: transferData.transfer.eventIndex ?? null,
        timestamp: new Date(transferData.transfer.timestamp),
        amount: BigInt(transferData.transfer.amount),
        fee: transferData.transfer.fee ? BigInt(transferData.transfer.fee) : 0n,
        success: transferData.transfer.success,
        from: await this.accountService.getOrCreateAccount(
          transferData.transfer.from.publicKey,
        ),
        to: await this.accountService.getOrCreateAccount(
          transferData.transfer.to.publicKey,
        ),
        blockchain,
      });
      const txKind =
        transferData.direction === TransferDirection.FROM
          ? TransactionKind.TRANSFER_FROM
          : TransactionKind.TRANSFER_TO;

      const transactionEntity = new Transaction({
        id: `${nativeTransferEntity.id}-${txKind}`,
        transferNative: nativeTransferEntity,
        txKind,
      });

      const accountTransaction = new AccountTransaction({
        id: `${this.commonUtils.getStringEndingShortcut(inputData.publicKey)}-${
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

    return {
      latestProcessedBlock:
        lastBlock ||
        inputData.latestProcessedBlock ||
        sourceIndexerStatus.height - 300,
      action: inputData.event,
      blockchainTag: inputData.blockchainTag,
    };
  }

  async collectTransferEventDataChunk(
    inputData: CollectEventDataChunkFromDataSourceInput,
  ): Promise<CollectTransfersChunkHandlerResponseResponse> {
    const responseBuffer: TransferDecoratedDto[] = [];
    let index = 1;

    const pubicKeyShort = `${inputData.publicKey.substring(
      0,
      5,
    )}..${inputData.publicKey.substring(
      inputData.publicKey.length - 5,
      inputData.publicKey.length - 1,
    )}`;

    const runQuery = async (offset: number = 0) => {
      const currentOffset = offset;
      console.log(
        `${pubicKeyShort} :: query START :: ${inputData.blockchainTag} :: ${inputData.chunkStartBlock}/${inputData.chunkEndBlock} :: offset ${currentOffset}`,
      );

      const resp = await this.dataSourceUtils.getTransfersByAccount({
        blockchainTag: inputData.blockchainTag,
        limit: pageSize,
        offset: currentOffset,
        publicKey: inputData.publicKey,
        blockNumber_gt: inputData.chunkStartBlock,
        blockNumber_lt: inputData.chunkEndBlock,
        queryUrl: inputData.sourceUrl,
      });
      console.log(
        `${pubicKeyShort} :: query COMPLETED :: ${inputData.blockchainTag} :: ${inputData.chunkStartBlock}/${inputData.chunkEndBlock} `,
      );
      if (resp.transfers.length === 0) return;
      responseBuffer.push(...resp.transfers);

      index++;
      await runQuery(currentOffset + pageSize);
    };
    const pageSize = 1000;
    await runQuery();
    return {
      fetchedChunkData:
        this.dataSourceUtils.getListWithoutDuplicates<TransferDecoratedDto>(
          responseBuffer,
          'id',
        ),
    };
  }

  async collectVoteEventData(inputData: CollectEventDataFromDataSourceInput) {}

  async collectRewardEventData(
    inputData: CollectEventDataFromDataSourceInput,
  ) {}
}
