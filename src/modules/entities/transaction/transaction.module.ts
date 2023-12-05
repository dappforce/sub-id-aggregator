import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction} from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import {DependencyServiceModule} from "../../../dependencyServiceModule.module";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), DependencyServiceModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
