import { Module } from '@nestjs/common';
import { DependencyServiceModule } from '../../dependencyServiceModule.module';
import { ApiGatewayService } from './services/apiGateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CommonUtils } from '../../utils/commonUtils';

@Module({
  imports: [
    DependencyServiceModule,
    TypeOrmModule.forFeature([]),
    BullModule.registerQueue({
      name: '',
    }),
  ],
  providers: [ApiGatewayService, CommonUtils],
  exports: [ApiGatewayService],
})
export class ApiGatewayModule {}
