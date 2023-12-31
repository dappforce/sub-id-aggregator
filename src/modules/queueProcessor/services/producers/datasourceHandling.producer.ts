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
import { CollectEventDataHandlerResponse } from '../../../dataAggregator/dto/collectEventDataHandler.response';
import { CollectEventDataChunkFromDataSourceInput } from '../../dto/collectEventDataChunkFromDataSource.input';
import { CollectTransfersChunkHandlerResponseResponse } from '../../../dataAggregator/dto/collectTransfersChunkHandlerResponse.response';

@Injectable()
export class DatasourceHandlingProducer {
  constructor(
    @InjectQueue(SubIdAggregatorQueueName.DATASOURCE_HANDLING)
    private datasourceHandlingQueue: Queue,
  ) {}

  getJobId(data: CollectEventDataFromDataSourceInput): string {
    return crypto.randomUUID();
  }

  async collectEventDataFromDataSourceJobProducer(
    requestData: CollectEventDataFromDataSourceInput,
  ) {
    return new Promise<CollectEventDataFromDataSourceResponse>(
      async (resolve, reject) => {
        const job = await this.datasourceHandlingQueue.add(
          requestData.event,
          requestData,
          {
            attempts: 20,
            jobId: this.getJobId(requestData),
            removeOnComplete: true,
            removeOnFail: false,
            priority: requestData.onDemand ? 1 : 2,
          },
        );

        const jobResult = await job.finished();

        // TODO add result check
        // TODO Add a watchdog to check if the job has finished periodically. Since pubsub does not give any guarantees.

        resolve({ jobResult: JSON.parse(jobResult), requestData });
      },
    );
  }
  //
  // async enqueueAndWaitCollectTransferEventDataChunkJobProducer(
  //   requestData: CollectEventDataChunkFromDataSourceInput,
  // ) {
  //   return new Promise<{
  //     jobResult: CollectTransfersChunkHandlerResponseResponse;
  //   }>(async (resolve, reject) => {
  //     const job = await this.datasourceHandlingQueue.add(
  //       'TRANSFER_CHUNK',
  //       requestData,
  //       {
  //         attempts: 20,
  //         jobId: crypto.randomUUID(),
  //         removeOnComplete: false,
  //         removeOnFail: false,
  //       },
  //     );
  //
  //     const jobResult = await job.finished();
  //
  //     // TODO add result check
  //     // TODO Add a watchdog to check if the job has finished periodically. Since pubsub does not give any guarantees.
  //
  //     resolve({ jobResult: JSON.parse(jobResult) });
  //   });
  // }
}
