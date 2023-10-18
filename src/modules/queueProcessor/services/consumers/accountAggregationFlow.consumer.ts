import { Injectable } from '@nestjs/common';
import {
  SubIdAggregatorJobName,
  SubIdAggregatorQueueName,
} from '../../../../constants/queues';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { RefreshAccountTxHistoryJobDataDto } from '../../dto/refreshAccountTxHistoryJobData.dto';
import { DataAggregatorService } from '../../../dataAggregator/services/dataAggregator.service';

@Processor(SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW)
export class AccountAggregationFlowConsumer {
  constructor(private dataAggregatorService: DataAggregatorService) {}

  @Process({
    name: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT,
    concurrency: 200,
  })
  async refresh_tx_history(job: Job<RefreshAccountTxHistoryJobDataDto>) {
    await job.takeLock();

    try {
      await this.dataAggregatorService.handleRefreshAccountTransactionsHistory(
        job.data,
      );

      await job.releaseLock();
      await job.moveToCompleted('done');
    } catch (e) {
      await job.releaseLock();
      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
    }
    return {};
  }
}
