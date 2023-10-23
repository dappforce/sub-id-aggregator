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

@Injectable()
export class AccountAggregationFlowProducer {
  constructor(
    @InjectQueue(SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW)
    private accountAggregationFlowQueue: Queue,
  ) {}

  getJobId(data: CollectEventDataFromDataSourceInput): string {
    return crypto.randomUUID();
  }

  async enqueueTask(args: EnqueueAccountAggregationJobInput) {
    const taskPayload: RefreshAccountTxHistoryJobDataDto = {
      requestId: crypto.randomUUID(),
      publicKey: args.publicKey,
      requestedAt: new Date().toISOString(),
    };

    const job = await this.accountAggregationFlowQueue.add(
      SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT,
      taskPayload,
      { attempts: 5, jobId: crypto.randomUUID() },
    );
  }
}
