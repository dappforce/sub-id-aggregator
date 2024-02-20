import { Injectable } from '@nestjs/common';

import { JobStatus, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import crypto from 'node:crypto';
import {
  SubIdAggregatorJobName,
  SubIdAggregatorQueueName,
} from '../../../../constants/queues';
import { CollectEventDataFromDataSourceInput } from '../../dto/collectEventDataFromDataSource.input';
import { CollectEventDataFromDataSourceResponse } from '../../dto/collectEventDataFromDataSource.response';
import { EnqueueAccountAggregationJobInput } from '../../dto/enqueueAccountAggregationJob.input';
import { RefreshAccountTxHistoryJobDataDto } from '../../dto/refreshAccountTxHistoryJobData.dto';
import { EnqueueAccountHistoryRenewRepeatableJobInput } from '../../dto/enqueueAccountHistoryRenewRepeatableJob.input';
import { CryptoUtils } from '../../../../utils/cryptoUtils';

@Injectable()
export class AccountAggregationFlowProducer {
  constructor(
    @InjectQueue(SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW)
    private accountAggregationFlowQueue: Queue,
    private cryptoUtils: CryptoUtils,
  ) {}

  getJobId(data: CollectEventDataFromDataSourceInput): string {
    return crypto.randomUUID();
  }

  async enqueueTask(args: EnqueueAccountAggregationJobInput) {
    const taskPayload: RefreshAccountTxHistoryJobDataDto = {
      publicKey: this.cryptoUtils.addressToHexIfNotHex(args.publicKey),
    };

    console.log(args);
    console.log(taskPayload);

    const job = await this.accountAggregationFlowQueue.add(
      args.jobName,
      taskPayload,
      {
        attempts: 5,
        jobId: `${args.publicKey}-${args.jobName}`,
        removeOnComplete: true,
        removeOnFail: false,
        ...(args.jobOptions || {}),
      },
    );

    const logsInterval = setInterval(async () => {
      const logs = await this.accountAggregationFlowQueue.getJobLogs(job.id);
      if (logs.count !== 0) {
        console.log(`Job ${job.name}/${job.id}`);
        console.dir(logs.logs, {
          depth: null,
        });
      }
    }, 500);

    return job;
  }

  async removeAllActiveJobs() {
    const allJobs = await this.accountAggregationFlowQueue.getJobs(['active']);

    for (const job of allJobs) {
      await job.remove();
    }
  }
}
