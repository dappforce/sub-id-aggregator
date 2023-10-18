import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AccountTransaction } from '../../accountTransaction/entities/accountTransaction.entity';
import GraphQLJSON from 'graphql-type-json';
import {
  BlockchainName,
  NativeTransactionKind,
} from '../../../../constants/common';

export type AccountLatestProcessedBlockMap = Record<
  BlockchainName,
  Record<NativeTransactionKind, number>
>;

@Entity()
@ObjectType()
export class Account {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @OneToMany(() => AccountTransaction, (accTx) => accTx.account, {
    nullable: true,
  })
  @Field(() => [AccountTransaction], { nullable: false, defaultValue: [] })
  transactions: AccountTransaction[];

  @Column('jsonb', { nullable: true, name: 'latest_processed_block' })
  @Field((type) => GraphQLJSON, { nullable: true })
  latestProcessedBlock?: AccountLatestProcessedBlockMap;
}
