import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blockchain } from './entities/blockchain.entity';
import { BlockchainService } from './blockchain.service';
import { DependencyServiceModule } from '../../../dependencyServiceModule.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blockchain]), DependencyServiceModule],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
