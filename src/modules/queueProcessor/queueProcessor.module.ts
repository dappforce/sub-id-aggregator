import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { AccountAggregationFlowConsumer } from './services/consumers/accountAggregationFlow.consumer';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule, BullBoardServerAdapter } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { SubIdAggregatorQueueName } from '../../constants/queues';
import { DatasourceHandlingProducer } from './services/producers/datasourceHandling.producer';

@Module({
  imports: [
    DependencyServiceModule,
    BullModule.registerQueue({
      name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
    }),
    BullBoardModule.forFeature({
      name: SubIdAggregatorQueueName.ACCOUNT_AGGREGATION_FLOW,
      adapter: BullAdapter,
    }),
  ],
  providers: [
    AccountAggregationFlowConsumer,
    DatasourceHandlingProducer,
  ],
  exports: [
    AccountAggregationFlowConsumer,
    DatasourceHandlingProducer,
  ],
})
export class QueueProcessorModule {}
