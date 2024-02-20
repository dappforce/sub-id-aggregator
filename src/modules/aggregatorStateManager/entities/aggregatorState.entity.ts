import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field } from '@nestjs/graphql';

@Entity()
export class AggregatorState {
  @PrimaryColumn()
  id: string;

  @Column('text', {
    array: true,
    nullable: false,
    default: [],
    name: 'one_time_jobs',
  })
  oneTimeJobs?: string[];
}
