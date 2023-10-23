import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependencyServiceModule } from '../dependencyServiceModule.module';
import { CommonBootstrapperService } from './common.bootstrapper.service';
import { Blockchain } from '../modules/entities/blockchain/entities/blockchain.entity';
import { BlockchainService } from '../modules/entities/blockchain/blockchain.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blockchain]), DependencyServiceModule],
  providers: [CommonBootstrapperService, BlockchainService],
})
export class PlatformBootstrapperModule {}
