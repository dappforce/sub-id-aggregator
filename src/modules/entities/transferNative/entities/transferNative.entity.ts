import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AccountTransaction } from '../../accountTransaction/entities/accountTransaction.entity';
import { GraphQLBigInt } from 'graphql-scalars';
import { Account } from '../../account/entities/account.entity';
import { Blockchain } from '../../blockchain/entities/blockchain.entity';
import { bigintTransformer } from '../../../../utils/typeOrmMarshal';

@Entity()
@ObjectType()
export class TransferNative {
  constructor(props?: TransferNative) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @ManyToOne(() => Blockchain, (blockchain) => blockchain.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'blockchain_id' })
  @Field(() => Blockchain, { nullable: false })
  blockchain: Blockchain;

  @Column({ nullable: false, name: 'block_number' })
  @Field(() => Int, { nullable: false })
  blockNumber: number;

  @Column({ nullable: true, name: 'extrinsic_hash' })
  @Field(() => String, { nullable: true })
  extrinsicHash?: string;

  @Column({ nullable: true, name: 'event_index' })
  @Field(() => Int, { nullable: true })
  eventIndex?: number;

  @Column({ type: 'timestamp with time zone', nullable: false })
  @Field(() => Date, { nullable: false })
  timestamp: Date;

  @Column({ type: 'numeric', transformer: bigintTransformer, nullable: false })
  @Field(() => GraphQLBigInt, { nullable: false })
  amount: bigint;

  @Column({ type: 'numeric', transformer: bigintTransformer, nullable: true })
  @Field(() => GraphQLBigInt, { nullable: true })
  fee?: bigint;

  @Column({ nullable: false })
  @Field(() => Boolean, { nullable: false })
  success: boolean;

  @ManyToOne(() => Account, (acc) => acc.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'from_id' })
  @Field(() => Account, { nullable: false })
  from: Account;

  @ManyToOne(() => Account, (acc) => acc.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'to_id' })
  @Field(() => Account, { nullable: false })
  to: Account;
}
