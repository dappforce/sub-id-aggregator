import { Injectable } from '@nestjs/common';

import { JobStatus, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import crypto from 'node:crypto';
import { SubIdAggregatorQueueName } from '../../../../constants/queues';
import { CollectEventDataChunkFromDataSourceInput } from '../../dto/collectEventDataChunkFromDataSource.input';
import { CollectTransfersChunkHandlerResponseResponse } from '../../../dataAggregator/dto/collectTransfersChunkHandlerResponse.response';

@Injectable()
export class DatasourceChunksParallelHandlingProducer {
  constructor(
    @InjectQueue(SubIdAggregatorQueueName.DATASOURCE_CHUNKS_PARALLEL_HANDLING)
    private datasourceChunksParallelHandlingQueue: Queue,
  ) {}

  async enqueueAndWaitCollectTransferEventDataChunkJobProducer(
    requestData: CollectEventDataChunkFromDataSourceInput,
  ) {
    return new Promise<{
      jobResult: CollectTransfersChunkHandlerResponseResponse;
    }>(async (resolve, reject) => {
      try {
        const job = await this.datasourceChunksParallelHandlingQueue.add(
          'TRANSFER_CHUNK',
          requestData,
          {
            attempts: 3,
            timeout: 60 * 1000,
            jobId: crypto.randomUUID(),
            removeOnComplete: false,
            removeOnFail: false,
            stackTraceLimit: 100,
            priority: requestData.onDemand ? 1 : 2,
          },
        );

        // Watchdog to check if the job has finished periodically. Since pubsub does not give any guarantees.

        const intervalInst = setInterval(async () => {
          const jobStatus = await job.getState();

          if (jobStatus === 'completed' || jobStatus === 'failed') {
            clearInterval(intervalInst);
            const jobRes =
              await this.datasourceChunksParallelHandlingQueue.getJob(job.id);
            if (!jobRes) {
              resolve({ jobResult: { fetchedChunkData: [] } });
              return;
            }
            await jobRes.remove();
            resolve({ jobResult: JSON.parse(jobRes.returnvalue) });
            return;
          }
        }, 500);
      } catch (e) {
        reject(e);
      }
    });
  }
}
