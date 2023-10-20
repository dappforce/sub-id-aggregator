import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { DependencyServiceModule } from '../../../dependencyServiceModule.module';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Blockchain } from '../blockchain/entities/blockchain.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Blockchain]),
    DependencyServiceModule,
  ],
  providers: [AccountService, BlockchainService],
  exports: [AccountService],
})
export class AccountModule {}
