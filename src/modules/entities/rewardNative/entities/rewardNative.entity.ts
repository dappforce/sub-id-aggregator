import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AccountTransaction } from '../../accountTransaction/entities/accountTransaction.entity';

@Entity()
@ObjectType()
export class RewardNative {
  @PrimaryColumn()
  @Field(() => String)
  id: string;
}
