import gql from 'graphql-tag';
import { HistoryElementFilter, Scalars } from './subquery-nova-query';

export const GET_TRANSFERS_BY_ACCOUNT_SUBQUERY = gql`
  query GetTransfersByAccountSubQuery(
    $filter: HistoryElementFilter!
    $offset: Int
    $first: Int
  ) {
    historyElements(filter: $filter, offset: $offset, first: $first) {
      nodes {
        transfer
        extrinsicHash
        extrinsicIdx
        blockNumber
        address
        timestamp
      }
    }
  }
`;

export const GET_INDEXER_LAST_PROCESSED_HEIGHT = gql`
  query GetIndexerLastProcessedHeightSubQuery {
    _metadata {
      lastProcessedHeight
    }
  }
`;
