import gql from 'graphql-tag';

export const GET_TRANSFERS_BY_ACCOUNT = gql`
  query GetTransfersByAccount(
    $where: TransferWhereInput!
    $limit: Int!
    $offset: Int!
    $orderBy: [TransferOrderByInput!]!
  ) {
    transfers(
      where: $where
      limit: $limit
      offset: $offset
      orderBy: $orderBy
    ) {
      id
      direction
      transfer {
        amount
        blockNumber
        extrinsicHash
        from {
          id
        }
        id
        success
        timestamp
        to {
          id
        }
      }
    }
  }
`;
