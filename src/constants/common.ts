export enum QueryOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum FindAccountTxHistoryOrderBy {
  timestamp = 'timestamp',
}

export enum VoteResult {
  AYE = 'AYE',
  NAY = 'NAY',
}

export enum TransactionKind {
  TRANSFER_TO = 'TRANSFER_TO',
  TRANSFER_FROM = 'TRANSFER_FROM',
  VOTE = 'VOTE',
  REWARD = 'REWARD',
}

export enum NativeTransactionKind {
  TRANSFER = 'TRANSFER',
  VOTE = 'VOTE',
  REWARD = 'REWARD',
}

export enum BlockchainName {
  POLKADOT = 'POLKADOT',
  KUSAMA = 'KUSAMA',
  MOONBEAM = 'MOONBEAM',
  MOONRIVER = 'MOONRIVER',
  ASTAR = 'ASTAR',
}
