import { NativeTransactionKind } from '../../../constants/common';
import { BlockchainTag } from '../../../constants/blockchain';

export class CollectEventDataHandlerResponse {
  latestProcessedBlock: number | null;
  action: NativeTransactionKind;
  blockchainTag: BlockchainTag;
}
