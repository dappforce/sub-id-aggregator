import { Injectable } from '@nestjs/common';
import { RefreshAccountTxHistoryJobDataDto } from '../../queueProcessor/dto/refreshAccountTxHistoryJobData.dto';
import { BlockchainService } from '../../entities/blockchain/blockchain.service';
import { DatasourceHandlingProducer } from '../../queueProcessor/services/producers/datasourceHandling.producer';
import { CollectEventDataFromDataSourceInput } from '../../queueProcessor/dto/collectEventDataFromDataSource.input';
import { AccountService } from '../../entities/account/account.service';
import { NativeTransactionKind } from '../../../constants/common';
import { CollectEventDataHandlerResponse } from '../dto/collectEventDataHandler.response';

@Injectable()
export class DataAggregatorService {
  constructor(
    private blockchainService: BlockchainService,
    private datasourceHandlingProducer: DatasourceHandlingProducer,
    private accountService: AccountService,
  ) {}

  async handleRefreshAccountTransactionsHistory(
    data: RefreshAccountTxHistoryJobDataDto,
  ) {
    // TODO add management of top level request from client
    // TODO add publicKey decoration

    const txAccount = await this.accountService.getOrCreateAccount(
      data.publicKey,
    );

    const aggregationResultByChain = await Promise.allSettled(
      this.blockchainService.blockchainDataSourceConfigs
        .map((chainData) => {
          const chainEvents: CollectEventDataFromDataSourceInput[] = [];
          for (const eventName in chainData.events) {
            chainEvents.push({
              event: eventName as NativeTransactionKind,
              publicKey: data.publicKey,
              blockchainTag: chainData.tag,
              sourceUrl: chainData.events[eventName],
              latestProcessedBlock:
                txAccount.latestProcessedBlock[chainData.tag][eventName],
            });
          }
          return chainEvents;
        })
        .flat()
        .map((collectReqInput) =>
          this.datasourceHandlingProducer.collectEventDataFromDataSource(
            collectReqInput,
          ),
        ),
    );

    const accountProcessingState = txAccount.latestProcessedBlock;
    for (const aggregationResult of aggregationResultByChain) {
      if (aggregationResult.status !== 'fulfilled') continue;

      const jobResult: CollectEventDataHandlerResponse =
        aggregationResult.value.jobResult;
      if (jobResult.latestProcessedBlock === null) continue;
      accountProcessingState[jobResult.blockchainTag][jobResult.action] =
        jobResult.latestProcessedBlock;
    }

    txAccount.latestProcessedBlock = accountProcessingState;
    await this.accountService.accountRepository.save(txAccount);

    return {};
  }
}
