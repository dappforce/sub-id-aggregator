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
import { NativeTransactionKind } from '../../../../constants/common';
import { BlockchainTag } from '../../../../constants/blockchain';

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
            attempts: 5,
            jobId: this.getJobId(requestData),
            removeOnComplete: false,
            removeOnFail: false,
            priority: requestData.onDemand ? 1 : 2,
          },
        );

        // Watchdog to check if the job has finished periodically. Since pubsub does not give any guarantees.

        const intervalInst = setInterval(async () => {
          const jobStatus = await job.getState();

          if (jobStatus === 'completed' || jobStatus === 'failed') {
            clearInterval(intervalInst);
            const jobRes = await this.datasourceHandlingQueue.getJob(job.id);

            if (!jobRes) {
              resolve({
                jobResult: {
                  latestProcessedBlock: requestData.latestProcessedBlock,
                  action: requestData.event,
                  blockchainTag: requestData.blockchainTag,
                },
                requestData,
              });
            }
            await jobRes.remove();
            resolve({ jobResult: JSON.parse(jobRes.returnvalue), requestData });
            return;
          }
        }, 500);
      },
    );
  }
  async removeAllActiveJobs() {
    const allJobs = await this.datasourceHandlingQueue.getJobs(['active']);

    for (const job of allJobs) {
      await job.remove();
    }
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
