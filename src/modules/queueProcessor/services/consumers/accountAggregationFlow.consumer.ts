import { Injectable } from '@nestjs/common';
import {
  SubIdAggregatorJobName,
  SubIdAggregatorQueueName,
} from '../../../../constants/queues';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { RefreshAccountTxHistoryJobDataDto } from '../../dto/refreshAccountTxHistoryJobData.dto';
import { DataAggregatorService } from '../../../dataAggregator/services/dataAggregator.service';
import { AccountAggregationFlowProducer } from '../producers/accountAggregationFlow.producer';
import { AccountSyncSchedulerService } from '../../../accountSyncScheduler/accountSyncScheduler.service';

@Processor(SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW)
export class AccountAggregationFlowConsumer {
  constructor(
    private dataAggregatorService: DataAggregatorService,
    private accountSyncSchedulerService: AccountSyncSchedulerService,
  ) {}

  @Process({
    name: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND,
    concurrency: 200,
  })
  async refresh_tx_history(job: Job<RefreshAccountTxHistoryJobDataDto>) {
    await job.takeLock();

    try {
      await this.dataAggregatorService.handleRefreshAccountTransactionsHistory(
        job.data,
      );
      console.log(
        'REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND:: handleRefreshAccountTransactionsHistory completed',
      );

      await this.accountSyncSchedulerService.createOrRenewAccountUpdateSubscription(
        { address: job.data.publicKey },
      );

      console.log(
        'REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND:: createOrRenewAccountUpdateSubscription completed',
      );

      await job.releaseLock();
      await job.moveToCompleted('done', true);
    } catch (e) {
      await job.releaseLock();
      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
    }
    return {};
  }

  @Process({
    name: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED,
    concurrency: 200,
  })
  async refresh_tx_history_scheduled(
    job: Job<RefreshAccountTxHistoryJobDataDto>,
  ) {
    await job.takeLock();

    try {
      await this.dataAggregatorService.handleRefreshAccountTransactionsHistory(
        job.data,
      );
      console.log(
        'REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED:: handleRefreshAccountTransactionsHistory completed',
      );

      await job.releaseLock();
      await job.moveToCompleted('done', true);
    } catch (e) {
      await job.releaseLock();
      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
    }
    return {};
  }
}

//
//
// async jobHandlerWrapper(
//   job: Job<RefreshAccountTxHistoryJobDataDto>,
//   callback: (job: Job<RefreshAccountTxHistoryJobDataDto>) => Promise<void>,
// ) {
//   await job.takeLock();
//
//   try {
//     await callback(job);
//     await job.releaseLock();
//     await job.moveToCompleted('done', true);
//   } catch (e) {
//     await job.releaseLock();
//     await job.moveToFailed({
//       message: (e as Error).message || 'Something went wrong.',
//     });
//   }
//   return {};
// }
//
// @Process({
//   name: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND,
//   concurrency: 200,
// })
// async refresh_tx_history(job: Job<RefreshAccountTxHistoryJobDataDto>) {
//   console.log('REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND :: start');
//   return this.jobHandlerWrapper(job, async (jobInner) => {
//     await this.dataAggregatorService.handleRefreshAccountTransactionsHistory(
//       jobInner.data,
//     );
//     console.log(
//       'REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND:: handleRefreshAccountTransactionsHistory completed',
//     );
//
//     await this.accountSyncSchedulerService.createOrRenewAccountUpdateSubscription(
//       { address: jobInner.data.publicKey },
//     );
//
//     console.log(
//       'REFRESH_TX_HISTORY_FOR_ACCOUNT_ON_DEMAND :: createOrRenewAccountUpdateSubscription completed',
//     );
//   });
// }
//
// @Process({
//   name: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED,
//   concurrency: 200,
// })
// async refresh_tx_history_scheduled(
//   job: Job<RefreshAccountTxHistoryJobDataDto>,
// ) {
//   console.log('REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED :: start');
//
//   return this.jobHandlerWrapper(job, async (jobInner) => {
//     await this.dataAggregatorService.handleRefreshAccountTransactionsHistory(
//       jobInner.data,
//     );
//     console.log(
//       'REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED :: handleRefreshAccountTransactionsHistory completed',
//     );
//   });
// }
