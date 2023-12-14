import { BlockchainTag } from '../../../constants/blockchain';

export class GetTransfersByAccountArgs {
  blockchainTag: BlockchainTag;
  limit: number;
  offset: number;
  blockNumber_gt: number;
  blockNumber_lt: number | null;
  publicKey?: string;
  address?: string;
  queryUrl: string;
}
