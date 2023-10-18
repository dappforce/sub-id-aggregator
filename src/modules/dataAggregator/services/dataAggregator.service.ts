import { Injectable } from '@nestjs/common';
import { RefreshAccountTxHistoryJobDataDto } from '../../queueProcessor/dto/refreshAccountTxHistoryJobData.dto';
import { BlockchainService } from '../../entities/blockchain/blockchain.service';
import { DatasourceHandlingProducer } from '../../queueProcessor/services/producers/datasourceHandling.producer';
import { CollectEventDataFromDataSourceInput } from '../../queueProcessor/dto/collectEventDataFromDataSource.input';
import { AccountService } from '../../entities/account/account.service';
import { NativeTransactionKind } from '../../../constants/common';

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

    const account = await this.accountService.getOrCreateAccount(
      data.publicKey,
    );

    const aggregationResultByChain = await Promise.allSettled(
      this.blockchainService.supportedBlockchains
        .map((chainData) => {
          const chainEvents: CollectEventDataFromDataSourceInput[] = [];
          for (const eventName in chainData.events) {
            chainEvents.push({
              event: eventName as NativeTransactionKind,
              publicKey: data.publicKey,
              blockchainTag: chainData.tag,
              sourceUrl: chainData.events[eventName],
              latestProcessedBlock: account.latestProcessedBlock[chainData.tag][eventName],
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

    console.log(aggregationResultByChain);
    return {};
  }
}
