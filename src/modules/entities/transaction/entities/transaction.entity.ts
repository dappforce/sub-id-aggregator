import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountTransaction } from '../../accountTransaction/entities/accountTransaction.entity';
import { TransactionKind } from '../../../../constants/common';
import { TransferNative } from '../../transferNative/entities/transferNative.entity';
import { VoteNative } from '../../voteNative/entities/voteNative.entity';
import { RewardNative } from '../../rewardNative/entities/rewardNative.entity';
import crypto from 'node:crypto';

@Entity()
@ObjectType()
export class Transaction {
  constructor(props?: Partial<Transaction>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({
    type: 'enum',
    enum: TransactionKind,
    nullable: false,
    name: 'tx_kind',
  })
  @Field(() => TransactionKind, { nullable: false })
  txKind: TransactionKind;

  @ManyToOne(() => TransferNative, (transfer) => transfer.id, {
    nullable: true,
  })
  @Field(() => TransferNative, { nullable: true })
  @JoinColumn({ name: 'transfer_native_id' })
  transferNative?: TransferNative;

  @ManyToOne(() => VoteNative, (vote) => vote.id, { nullable: true })
  @Field(() => VoteNative, { nullable: true })
  @JoinColumn({ name: 'vote_native_id' })
  voteNative?: VoteNative;

  @ManyToOne(() => VoteNative, (vote) => vote.id, { nullable: true })
  @Field(() => VoteNative, { nullable: true })
  @JoinColumn({ name: 'reward_native_id' })
  rewardNative?: RewardNative;
}
