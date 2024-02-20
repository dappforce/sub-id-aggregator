import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BlockchainService } from '../modules/entities/blockchain/blockchain.service';
import { OneTimeJobsManagerService } from '../modules/aggregatorStateManager/oneTimeJobsManager.service';

@Injectable()
export class CommonBootstrapperService implements OnApplicationBootstrap {
  constructor(
    private blockchainService: BlockchainService,
    private oneTimeJobsManagerService: OneTimeJobsManagerService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.blockchainService.initSupportedBlockchains();

    await this.oneTimeJobsManagerService.runOneTimeJobs();
  }
}
