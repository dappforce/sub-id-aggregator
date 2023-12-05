import { SubIdAggregatorQueueName } from '../../../../constants/queues';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AggregationHelper } from '../../../dataAggregator/services/aggregation.helper';
import { CollectEventDataFromDataSourceInput } from '../../dto/collectEventDataFromDataSource.input';
import { NativeTransactionKind } from '../../../../constants/common';
import { CollectEventDataChunkFromDataSourceInput } from '../../dto/collectEventDataChunkFromDataSource.input';

@Processor(SubIdAggregatorQueueName.DATASOURCE_CHUNKS_PARALLEL_HANDLING)
export class DatasourceChunkParallelHandlingConsumer {
  constructor(private aggregationHelper: AggregationHelper) {}

  @Process({
    name: 'TRANSFER_CHUNK',
    concurrency: 200,
  })
  async collectAccountTransfersChunk(
    job: Job<CollectEventDataChunkFromDataSourceInput>,
  ) {
    await job.takeLock();

    try {
      const result = await this.aggregationHelper.collectTransferEventDataChunk(
        job.data,
      );

      await job.releaseLock();
      await job.moveToCompleted(JSON.stringify(result), true);
    } catch (e) {
      await job.releaseLock();
      await job.moveToFailed({
        message: (e as Error).message || 'Something went wrong.',
      });
    }
    return {};
  }
}
