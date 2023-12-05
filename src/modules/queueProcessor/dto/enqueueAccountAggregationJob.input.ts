import { Field, InputType } from '@nestjs/graphql';
import { JobOptions } from 'bull';
import { SubIdAggregatorJobName } from '../../../constants/queues';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class EnqueueAccountAggregationJobInput {
  @Field(() => String, { nullable: false })
  publicKey: string;

  @Field(() => String, { nullable: false })
  jobName: SubIdAggregatorJobName;

  @Field(() => GraphQLJSON, { nullable: true })
  jobOptions?: Partial<JobOptions>;
}
