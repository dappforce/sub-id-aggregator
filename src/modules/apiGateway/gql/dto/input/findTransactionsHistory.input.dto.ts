import { ArgsType, InputType, Field, PartialType, Int } from '@nestjs/graphql';
import {
  FindAccountTxHistoryOrderBy,
  QueryOrder,
  TransactionKind,
} from '../../../../../constants/common';
import { IsValidSubstrateAddress } from '../../../../../common/validators/validators';
import { BlockchainTag } from '../../../../../constants/blockchain';

@InputType()
export class FindAccountTxHistoryWhereParams {
  @Field(() => String, { nullable: true })
  @IsValidSubstrateAddress()
  publicKey?: string;

  @Field(() => BlockchainTag, { nullable: true })
  blockchainTag?: BlockchainTag;

  @Field(() => TransactionKind, { nullable: true })
  txKind?: TransactionKind;
}

@InputType()
export class FindAccountTxHistoryArgs {
  @Field(() => FindAccountTxHistoryWhereParams!, { nullable: false })
  where: FindAccountTxHistoryWhereParams;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number;

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  pageSize?: number;

  @Field(() => FindAccountTxHistoryOrderBy, {
    nullable: true,
    defaultValue: FindAccountTxHistoryOrderBy.timestamp,
  })
  orderBy?: FindAccountTxHistoryOrderBy;

  @Field(() => QueryOrder, { nullable: true, defaultValue: QueryOrder.DESC })
  orderDirection?: QueryOrder;
}
