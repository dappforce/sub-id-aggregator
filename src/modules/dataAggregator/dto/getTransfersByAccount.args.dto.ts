import { BlockchainTag } from '../../../constants/blockchain';
import { ApolloLink } from '@apollo/client/core';
import { DataSourceEmptyResponsePlaceholderDto } from './dataSourceEmptyResponsePlaceholder.dto';

export class GetTransfersByAccountArgs extends DataSourceEmptyResponsePlaceholderDto {
  blockchainTag: BlockchainTag;
  limit: number;
  offset: number;
  blockNumber_gt: number;
  blockNumber_lt: number | null;
  publicKey?: string;
  address?: string;
  queryUrl: string | ApolloLink;
}
