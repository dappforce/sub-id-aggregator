import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EnqueueAccountAggregationJobInput {
  @Field(() => String, { nullable: false })
  publicKey: string;
}
