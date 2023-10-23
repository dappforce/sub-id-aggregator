import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { GraphQLBigInt } from 'graphql-scalars';
import 'json-bigint-patch';
import { Account } from '../../account/entities/account.entity';
import {
  TransactionKind,
  VoteResult,
} from '../../../../constants/common';
import { Blockchain } from '../../blockchain/entities/blockchain.entity';
import { TransferNative } from '../../transferNative/entities/transferNative.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import crypto from 'node:crypto';
import { BlockchainTag } from '../../../../constants/blockchain';

@Entity()
@ObjectType()
@Index([
  'txKind',
  'blockchainTag',
  'senderOrTargetPublicKey',
  'timestamp',
  'success',
])
export class AccountTransaction {
  constructor(props?: Partial<AccountTransaction>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({
    type: 'enum',
    enum: VoteResult,
    nullable: true,
    name: 'vote_result',
  })
  @Field(() => VoteResult, { nullable: true })
  voteResult?: VoteResult;

  @Column({
    type: 'enum',
    enum: TransactionKind,
    nullable: true,
    name: 'tx_kind',
  })
  @Field(() => TransactionKind, { nullable: true })
  txKind?: TransactionKind;

  @ManyToOne(() => Account, (acc) => acc.transactions, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  @Field(() => Account, { nullable: false })
  account: Account;

  @Column({
    type: 'enum',
    enum: BlockchainTag,
    nullable: false,
    name: 'blockchain_tag',
  })
  @Field(() => BlockchainTag, { nullable: false })
  blockchainTag: string;

  @Column({ type: 'bigint', nullable: true })
  @Field(() => GraphQLBigInt, { nullable: false })
  amount?: bigint;

  @Column({ nullable: true, name: 'sender_or_target_public_key' })
  @Field(() => String, { nullable: true })
  senderOrTargetPublicKey: string;

  @ManyToOne(() => Blockchain, (blockchain) => blockchain.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'blockchain_id' })
  @Field(() => Blockchain, { nullable: false })
  blockchain: Blockchain;

  @Column({ type: 'timestamp with time zone', nullable: false })
  @Field(() => Date, { nullable: false })
  timestamp: Date;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: false })
  success: boolean;

  @OneToOne(() => Transaction, (tx) => tx.id, { nullable: false })
  @JoinColumn({ name: 'transaction_id' })
  @Field(() => Transaction, { nullable: false })
  transaction: Transaction;
}
