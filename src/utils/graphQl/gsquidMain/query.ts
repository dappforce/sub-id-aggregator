import gql from 'graphql-tag';
import { TransferOrderByInput } from './gsquid-main-query';

export const GET_TRANSFERS_BY_ACCOUNT_SUBSQUID = gql`
  query GetTransfersByAccountSubSquid(
    $where: TransferWhereInput!
    $limit: Int!
    $offset: Int! #    $orderBy: [TransferOrderByInput!]!
  ) {
    transfers(
      where: $where
      limit: $limit
      offset: $offset #      orderBy: $orderBy
    ) {
      id
      direction
      transfer {
        amount
        blockNumber
        extrinsicHash
        from {
          publicKey
        }
        id
        success
        timestamp
        to {
          publicKey
        }
      }
    }
  }
`;

export const GET_TRANSFERS_COUNT_BY_ACCOUNT_SUBSQUID = gql`
  query GetTransfersCountByAccountSubSquid(
    $where: TransferWhereInput!
    $orderBy: [TransferOrderByInput!]!
  ) {
    transfersConnection(where: $where, orderBy: $orderBy) {
      totalCount
    }
  }
`;

export const GET_MAIN_SQUID_STATUS_SUBSQUID = gql`
  query GetMainSquidStatusSubSquid {
    squidStatus {
      height
    }
  }
`;
