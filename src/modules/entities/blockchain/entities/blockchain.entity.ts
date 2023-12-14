import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BlockchainTag } from '../../../../constants/blockchain';
import * as crypto from 'node:crypto';

@Entity()
@ObjectType()
export class Blockchain {
  @PrimaryColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  text: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  info: string;

  @Column('text', { array: true, default: [], nullable: true })
  @Field(() => [String], { nullable: true, defaultValue: [] })
  symbols: string[];

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  prefix?: number;

  @Column({
    type: 'enum',
    enum: BlockchainTag,
    nullable: false,
    name: 'tag',
  })
  @Field(() => BlockchainTag, { nullable: false })
  tag: BlockchainTag;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  decimal: number;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  logo: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  color: string;

  constructor() {
    this.id = crypto.randomUUID();
  }
}
