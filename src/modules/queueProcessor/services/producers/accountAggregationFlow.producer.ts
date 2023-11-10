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
      publicKey: this.cryptoUtils.substrateAddressToHex(args.publicKey),
    };

    console.log(args);

    const job = await this.accountAggregationFlowQueue.add(
      args.jobName,
      taskPayload,
      {
        attempts: 5,
        jobId: args.publicKey,
        removeOnComplete: true,
        removeOnFail: true,
        ...(args.jobOptions || {}),
      },
    );

    console.log('job.id - ', job.id);

    return job;
  }
}
