import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { QueueProcessorService } from './services/queueProcessor.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule, BullBoardServerAdapter } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    DependencyServiceModule,
    BullModule.registerQueue({
      name: 'queue1',
    }),
    BullBoardModule.forFeature({
      name: 'queue1',
      adapter: BullAdapter,
    }),
  ],
  providers: [QueueProcessorService],
  exports: [QueueProcessorService],
})
export class QueueProcessorModule {}
