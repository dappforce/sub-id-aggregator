import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AccountTransaction } from '../../accountTransaction/entities/accountTransaction.entity';
import GraphQLJSON from 'graphql-type-json';
import { NativeTransactionKind } from '../../../../constants/common';
import { BlockchainTag } from '../../../../constants/blockchain';
import { HistoryUpdateSubscription } from '../../../accountSyncScheduler/entities/historyUpdateSubscription.entity';

export type AccountLatestProcessedBlockMap = Record<
  BlockchainTag,
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

  @OneToMany(() => HistoryUpdateSubscription, (sub) => sub.account, {
    nullable: true,
  })
  @Field(() => [HistoryUpdateSubscription], {
    nullable: true,
  })
  updateSubscriptions: HistoryUpdateSubscription[] | null;

  @Column('jsonb', { nullable: true, name: 'latest_processed_block' })
  @Field((type) => GraphQLJSON, { nullable: true })
  latestProcessedBlock?: AccountLatestProcessedBlockMap;
}
