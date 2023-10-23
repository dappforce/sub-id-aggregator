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

@Entity()
@ObjectType()
export class TransferNative {
  constructor(props?: TransferNative) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({ nullable: false, name: 'block_number' })
  @Field(() => Int, { nullable: false })
  blockNumber: number;

  @Column({ nullable: false, name: 'extrinsic_hash' })
  @Field(() => String, { nullable: false })
  extrinsicHash: string;

  @Column({ type: 'timestamp with time zone', nullable: false })
  @Field(() => Date, { nullable: false })
  timestamp: Date;

  @Column({ type: 'bigint', nullable: true })
  @Field(() => GraphQLBigInt, { nullable: false })
  amount: bigint;

  @Column({ nullable: true })
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
