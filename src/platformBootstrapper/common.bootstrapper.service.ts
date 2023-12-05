import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BlockchainService } from '../modules/entities/blockchain/blockchain.service';

@Injectable()
export class CommonBootstrapperService implements OnApplicationBootstrap {
  constructor(private blockchainService: BlockchainService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.blockchainService.initSupportedBlockchains();
  }
}
