import { BlockchainName, NativeTransactionKind } from '../../../constants/common';

export class CollectEventDataFromDataSourceInput {
  blockchainTag: BlockchainName;
  event: NativeTransactionKind;
  publicKey: string;
  sourceUrl: string;
  latestProcessedBlock: number;
}
