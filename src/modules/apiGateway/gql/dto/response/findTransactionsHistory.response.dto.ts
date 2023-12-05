import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AccountTransaction } from '../../../../entities/accountTransaction/entities/accountTransaction.entity';

@ObjectType()
export class FindTransactionsHistoryResponseDto {
  @Field(() => [AccountTransaction], { nullable: false })
  data: AccountTransaction[];

  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => Int, { nullable: true })
  offset: number;

  @Field(() => Int, { nullable: true })
  pageSize: number;
}
