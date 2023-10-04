import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { DataAggregatorService } from './services/dataAggregator.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DependencyServiceModule, TypeOrmModule.forFeature([])],
  providers: [DataAggregatorService],
  exports: [DataAggregatorService],
})
export class DataAggregatorModule {}
