import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AccountTransaction } from '../../../../entities/accountTransaction/entities/accountTransaction.entity';

@ObjectType()
export class RefreshTxHistoryResponseDto {
  @Field(() => Boolean, { nullable: true })
  success: boolean;
}
