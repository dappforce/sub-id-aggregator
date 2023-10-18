import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AccountTransaction } from '../../accountTransaction/entities/accountTransaction.entity';
import { BlockchainName, TransactionKind } from '../../../../constants/common';

@Entity()
@ObjectType()
export class Blockchain {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: BlockchainName,
    nullable: false,
    name: 'tag',
  })
  @Field(() => BlockchainName, { nullable: false })
  tag: BlockchainName;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  code: string;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  decimal: number;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  icon: string;
}
