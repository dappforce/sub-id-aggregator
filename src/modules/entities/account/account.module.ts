import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import {DependencyServiceModule} from "../../../dependencyServiceModule.module";

@Module({
  imports: [TypeOrmModule.forFeature([Account]), DependencyServiceModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
