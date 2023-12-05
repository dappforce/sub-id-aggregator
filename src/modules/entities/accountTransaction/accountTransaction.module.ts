import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTransactionService } from './accountTransaction.service';
import { DependencyServiceModule } from '../../../dependencyServiceModule.module';
import { AccountTransaction } from './entities/accountTransaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTransaction]),
    DependencyServiceModule,
  ],
  providers: [AccountTransactionService],
  exports: [AccountTransactionService],
})
export class AccountTransactionModule {}
