import { ApolloLink } from '@apollo/client/core';
import { DataSourceEmptyResponsePlaceholderDto } from './dataSourceEmptyResponsePlaceholder.dto';

export class GetIndexerLastProcessedHeightArgs extends DataSourceEmptyResponsePlaceholderDto {
  queryUrl: string | ApolloLink;
}
