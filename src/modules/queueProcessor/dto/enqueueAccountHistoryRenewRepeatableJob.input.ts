import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class EnqueueAccountHistoryRenewRepeatableJobInput {
  @Field(() => String, { nullable: false })
  publicKey: string;

  @Field(() => Int, { nullable: false })
  every: number;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  count?: number;
}
