import { registerEnumType } from '@nestjs/graphql';
import {
  FindAccountTxHistoryOrderBy,
  NativeTransactionKind,
  QueryOrder,
  TransactionKind, TransferDirection,
  VoteResult,
} from '../../constants/common';
import { BlockchainTag } from '../../constants/blockchain';

registerEnumType(QueryOrder, {
  name: 'QueryOrder',
});

registerEnumType(FindAccountTxHistoryOrderBy, {
  name: 'FindAccountTxHistoryOrderBy',
});

registerEnumType(VoteResult, {
  name: 'VoteResult',
});

registerEnumType(TransactionKind, {
  name: 'TransactionKind',
});

registerEnumType(NativeTransactionKind, {
  name: 'NativeTransactionKind',
});

registerEnumType(BlockchainTag, {
  name: 'BlockchainTag',
});

registerEnumType(TransferDirection, {
  name: 'TransferDirection',
});
