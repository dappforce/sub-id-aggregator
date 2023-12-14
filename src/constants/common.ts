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

export enum TransferDirection {
  FROM = 'FROM',
  TO = 'TO',
}

export enum NativeTransactionKind {
  TRANSFER = 'TRANSFER',
  VOTE = 'VOTE',
  REWARD = 'REWARD',
}

export enum DataSourceProviders {
  SUBSQUID = 'SUBSQUID',
  SUBQUERY = 'SUBQUERY',
}