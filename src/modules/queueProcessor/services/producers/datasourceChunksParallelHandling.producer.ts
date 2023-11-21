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

  async enqueueAndWaitCollectTransferEventDataChunk(
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
            attempts: 20,
            jobId: crypto.randomUUID(),
            removeOnComplete: false,
            removeOnFail: false,
          },
        );

        const jobResult = await job.finished();
        // TODO add result check
        // TODO Add a watchdog to check if the job has finished periodically. Since pubsub does not give any guarantees.
        resolve({ jobResult: JSON.parse(jobResult) });
      } catch (e) {
        reject(e);
      }
    });
  }
}
