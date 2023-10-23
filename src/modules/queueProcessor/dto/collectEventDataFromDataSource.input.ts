import { NativeTransactionKind } from '../../../constants/common';
import { BlockchainTag } from '../../../constants/blockchain';

export class CollectEventDataFromDataSourceInput {
  blockchainTag: BlockchainTag;
  event: NativeTransactionKind;
  publicKey: string;
  sourceUrl: string;
  latestProcessedBlock: number;
}
