import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BlockchainService } from '../modules/entities/blockchain/blockchain.service';
import { OneTimeJobsManagerService } from '../modules/aggregatorStateManager/oneTimeJobsManager.service';
import { RedisClientManagerService } from '../modules/redisManagerModule/services/redisClientManager.service';

@Injectable()
export class CommonBootstrapperService implements OnApplicationBootstrap {
  constructor(
    private blockchainService: BlockchainService,
    private redisClientManagerService: RedisClientManagerService,
    private oneTimeJobsManagerService: OneTimeJobsManagerService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.blockchainService.initSupportedBlockchains();

    await this.redisClientManagerService.runRedisMigrations();

    await this.oneTimeJobsManagerService.runOneTimeJobs();
  }
}
