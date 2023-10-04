import { Module } from '@nestjs/common';
import { CryptoUtils } from './utils/cryptoUtils';
import { CommonUtils } from './utils/commonUtils';

@Module({
  providers: [CryptoUtils, CommonUtils],
  exports: [CryptoUtils, CommonUtils],
})
export class DependencyServiceModule {}
