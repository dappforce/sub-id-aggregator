import { Injectable } from '@nestjs/common';
import {
  SubIdAggregatorJobName,
  SubIdAggregatorQueueName,
} from '../../../../constants/queues';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { RefreshAccountTxHistoryJobDataDto } from '../../dto/refreshAccountTxHistoryJobData.dto';
import { DataAggregatorService } from '../../../dataAggregator/services/dataAggregator.service';
import { AggregationHelper } from '../../../dataAggregator/services/aggregation.helper';
import { CollectEventDataFromDataSourceInput } from '../../dto/collectEventDataFromDataSource.input';
import { NativeTransactionKind } from '../../../../constants/common';

@Processor(SubIdAggregatorQueueName.DATASOURCE_HANDLING)
export class DatasourceHandlingConsumer {
  constructor(private aggregationHelper: AggregationHelper) {}

  @Process({
    name: NativeTransactionKind.TRANSFER,
    concurrency: 200,
  })
  async collectAccountTransfers(job: Job<CollectEventDataFromDataSourceInput>) {
    await job.takeLock();

    try {
      const result = await this.aggregationHelper.collectTransferEventData(
        job.data,
      );

      await job.releaseLock();
      await job.moveToCompleted(JSON.stringify(result));
    } catch (e) {
      await job.releaseLock();
      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
    }
    return {};
  }

  @Process({
    name: NativeTransactionKind.VOTE,
    concurrency: 200,
  })
  async collectAccountVotes(job: Job<CollectEventDataFromDataSourceInput>) {
    await job.takeLock();

    try {
      await this.aggregationHelper.collectVoteEventData(job.data);

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

  @Process({
    name: NativeTransactionKind.REWARD,
    concurrency: 200,
  })
  async collectAccountRewards(job: Job<CollectEventDataFromDataSourceInput>) {
    await job.takeLock();

    try {
      await this.aggregationHelper.collectRewardEventData(job.data);

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
