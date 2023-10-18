import { registerEnumType } from '@nestjs/graphql';
import {
  BlockchainName,
  FindAccountTxHistoryOrderBy,
  NativeTransactionKind,
  QueryOrder,
  TransactionKind,
  VoteResult,
} from '../../constants/common';

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

registerEnumType(BlockchainName, {
  name: 'BlockchainName',
});
