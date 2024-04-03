import { Injectable } from '@nestjs/common';
import { AggregatorStateManagerService } from './aggregatorStateManager.service';
import { AccountAggregationFlowProducer } from '../queueProcessor/services/producers/accountAggregationFlow.producer';
import { DatasourceChunksParallelHandlingProducer } from '../queueProcessor/services/producers/datasourceChunksParallelHandling.producer';
import { DatasourceHandlingProducer } from '../queueProcessor/services/producers/datasourceHandling.producer';

type TerminateAllActiveJobsJobPayload = {};

type OneTimeJob = { id: string; action: string } & {
  payload: TerminateAllActiveJobsJobPayload;
};

const oneTimeJobsList: OneTimeJob[] = [
  {
    id: '1712148386341',
    action: 'removeAllActiveJobs',
    payload: {},
  },
  {
    id: '1712148398499',
    action: 'redisBgrewriteaof',
    payload: {},
  },
];

@Injectable()
export class OneTimeJobsManagerService {
  constructor(
    public aggregatorStateManagerService: AggregatorStateManagerService,
    public accountAggregationFlowProducer: AccountAggregationFlowProducer,
    public datasourceChunksParallelHandlingProducer: DatasourceChunksParallelHandlingProducer,
    public datasourceHandlingProducer: DatasourceHandlingProducer,
  ) {}

  async runOneTimeJobs() {
    const migrationsMap = new Map(
      oneTimeJobsList.map((item) => [item.id, item]),
    );
    let pendingMigrationIds: string[] = [];
    const aggregatorState =
      await this.aggregatorStateManagerService.getOrCreateAggregatorState();

    if (
      !aggregatorState.oneTimeJobs ||
      aggregatorState.oneTimeJobs.length === 0
    ) {
      pendingMigrationIds = [...migrationsMap.keys()];
    } else {
      for (const item of aggregatorState.oneTimeJobs) {
        migrationsMap.delete(item);
      }
      pendingMigrationIds = [...migrationsMap.keys()];
    }

    if (!pendingMigrationIds || pendingMigrationIds.length === 0) {
      console.log(`OneTime Jobs :: No pending OneTime Job found.`);
      return;
    }

    const processedJobs = [];

    console.log('pendingOneTimeJobIds - ', pendingMigrationIds);

    for (const jobId of pendingMigrationIds) {
      const jobDetails = migrationsMap.get(jobId);

      switch (jobDetails.action) {
        case 'removeAllActiveJobs': {
          try {
            await this.accountAggregationFlowProducer.removeAllActiveJobs();
            await this.datasourceChunksParallelHandlingProducer.removeAllActiveJobs();
            await this.datasourceHandlingProducer.removeAllActiveJobs();

            processedJobs.push(jobId);
            console.log(
              `OneTime Jobs :: OneTime Job has been completed with details: [id: ${jobDetails.id} // action: ${jobDetails.action}]`,
            );
          } catch (e) {
            console.log(
              `OneTime Jobs :: OneTime Job ${jobId} has been processed with error.`,
            );
            console.log(e);
          }
          break;
        }
        case 'redisBgrewriteaof': {
          try {
            await this.datasourceHandlingProducer.refreshRedisAofFile();

            processedJobs.push(jobId);
            console.log(
              `OneTime Jobs :: OneTime Job has been completed with details: [id: ${jobDetails.id} // action: ${jobDetails.action}]`,
            );
          } catch (e) {
            console.log(
              `OneTime Jobs :: OneTime Job ${jobId} has been processed with error.`,
            );
            console.log(e);
          }
          break;
        }

        default:
      }
    }

    await this.aggregatorStateManagerService.updateDataSourcesState({
      oneTimeJobs: [
        ...new Set([...aggregatorState.oneTimeJobs, ...processedJobs]).values(),
      ],
    });
  }
}
