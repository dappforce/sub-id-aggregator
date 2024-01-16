import { Global, Module } from '@nestjs/common';
import { CryptoUtils } from './utils/cryptoUtils';
import { CommonUtils } from './utils/commonUtils';
import { DataSourceUtils } from './utils/dataSources/dataSourceUtils';

@Global()
@Module({
  providers: [CryptoUtils, CommonUtils, DataSourceUtils],
  exports: [CryptoUtils, CommonUtils, DataSourceUtils],
})
export class DependencyServiceModule {}
