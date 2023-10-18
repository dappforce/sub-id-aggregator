import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
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
    this.id = crypto.randomUUID();
    Object.assign(this, props);
  }

  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({
    type: 'enum',
    enum: TransactionKind,
    nullable: false,
  })
  @Field(() => TransactionKind, { nullable: false })
  txKind: TransactionKind;

  @OneToOne(() => TransferNative, (transfer) => transfer.id, { nullable: true })
  @Field(() => TransferNative, { nullable: true })
  transferNative?: TransferNative;

  @OneToOne(() => VoteNative, (vote) => vote.id, { nullable: true })
  @Field(() => VoteNative, { nullable: true })
  voteNative?: VoteNative;

  @OneToOne(() => VoteNative, (vote) => vote.id, { nullable: true })
  @Field(() => VoteNative, { nullable: true })
  rewardNative?: RewardNative;
}
