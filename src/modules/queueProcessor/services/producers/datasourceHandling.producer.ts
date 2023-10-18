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

@Injectable()
export class DatasourceHandlingProducer {
  constructor(
    @InjectQueue(SubIdAggregatorQueueName.DATASOURCE_HANDLING)
    private datasourceHandlingQueue: Queue,
  ) {}

  getJobId(data: CollectEventDataFromDataSourceInput): string {
    return crypto.randomUUID();
  }

  // async enqueueJob({
  //   jobData,
  //   queueName,
  //   jobId,
  //   jobPriority = 1,
  // }: {
  //   jobData: EnqueueJobData;
  //   queueName: DataHubQueueName;
  //   jobId: string;
  //   jobPriority: number;
  // }): Promise<string> {
  //   const job = await this.queueHandlersMap
  //     .get(queueName)
  //     .add(jobData.payload.callData.name, jobData, {
  //       attempts: 5,
  //       priority: jobPriority,
  //       ...(jobId ? { jobId } : {}),
  //     });
  //   console.log(`job created - ${job.id} - with priority ${jobPriority}`);
  //   return job.id.toString();
  // }

  async collectEventDataFromDataSource(
    requestData: CollectEventDataFromDataSourceInput,
  ) {
    return new Promise<CollectEventDataFromDataSourceResponse>(
      async (resolve, reject) => {
        const job = await this.datasourceHandlingQueue.add(
          requestData.event,
          requestData,
          { attempts: 5, jobId: this.getJobId(requestData) },
        );

        const jobResult = await job.finished();

        // TODO add result check
        // TODO Add a watchdog to check if the job has finished periodically. Since pubsub does not give any guarantees.

        resolve({ event: requestData.event, success: jobResult.success });
      },
    );
  }
}
