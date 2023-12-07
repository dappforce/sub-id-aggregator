import { NativeTransactionKind } from '../../../constants/common';
import { BlockchainTag } from '../../../constants/blockchain';

export class CollectEventDataChunkFromDataSourceInput {
  blockchainTag: BlockchainTag;
  event: NativeTransactionKind;
  publicKey: string;
  sourceUrl: string;
  chunkStartBlock: number;
  chunkEndBlock: number | null;
  onDemand?: boolean
}
