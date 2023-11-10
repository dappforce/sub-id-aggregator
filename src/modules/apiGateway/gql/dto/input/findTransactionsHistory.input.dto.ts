import { ArgsType, InputType, Field, PartialType, Int } from '@nestjs/graphql';
import {
  FindAccountTxHistoryOrderBy,
  QueryOrder,
} from '../../../../../constants/common';
import { IsValidSubstrateAddress } from '../../../../../common/validators/validators';

@InputType()
export class FindAccountTxHistoryArgs {
  @Field(() => String!, { nullable: false })
  @IsValidSubstrateAddress()
  publicKey: string;

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
