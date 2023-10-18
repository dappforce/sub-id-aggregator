import gql from 'graphql-tag';

export const GET_TRANSFERS_BY_ACCOUNT = gql`
  query GetTransfersByAccount($where: TransferWhereInput!) {
    transfers(where: $where) {
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
