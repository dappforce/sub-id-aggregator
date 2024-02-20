import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AggregatorState } from './entities/aggregatorState.entity';

@Injectable()
export class AggregatorStateManagerService {
  constructor(
    @InjectRepository(AggregatorState)
    public readonly aggregatorStateRepository: Repository<AggregatorState>,
  ) {}

  async getOrCreateAggregatorState() {
    let existingState = await this.aggregatorStateRepository.findOne({
      where: { id: '1' },
    });
    if (existingState) return existingState;
    existingState = new AggregatorState();
    existingState.id = '1';
    existingState.oneTimeJobs = [];
    await this.aggregatorStateRepository.save(existingState);
    return existingState;
  }

  async updateDataSourcesState(newState: Partial<AggregatorState>) {
    const stateEntity = await this.getOrCreateAggregatorState();

    if ('oneTimeJobs' in newState)
      stateEntity.oneTimeJobs = newState.oneTimeJobs;

    await this.aggregatorStateRepository.save(stateEntity);
    return stateEntity;
  }
}
