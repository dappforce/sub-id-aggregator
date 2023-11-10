import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Account } from '../../entities/account/entities/account.entity';
import * as crypto from 'node:crypto';

@Entity()
@ObjectType()
export class HistoryUpdateSubscription {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @ManyToOne(() => Account, (acc) => acc.updateSubscriptions, {
    nullable: false,
  })
  @JoinColumn({ name: 'account_id' })
  @Field(() => Account, { nullable: false })
  account: Account;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'created_at',
  })
  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    name: 'executed_at',
  })
  @Field(() => Date, { nullable: true })
  executedAt?: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'latest_history_request_at',
  })
  @Field(() => Date, { nullable: false })
  latestHistoryRequestAt: Date;

  @Column({ nullable: false, name: 'update_interval_ms' })
  @Field(() => Int, { nullable: false })
  updateIntervalMs: number;

  constructor() {
    this.id = crypto.randomUUID();
  }
}
