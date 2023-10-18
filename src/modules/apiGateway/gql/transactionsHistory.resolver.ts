import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FindAccountTxHistoryArgs } from './dto/input/findTransactionsHistory.input.dto';
import { FindTransactionsHistoryResponseDto } from './dto/response/findTransactionsHistory.response.dto';
import { ApiGatewayService } from '../services/apiGateway.service';

@Resolver()
export class TransactionsHistoryResolver {
  constructor(private apiGatewayService: ApiGatewayService) {}

  @Query(() => String)
  findAccountTxHistory(
    @Args('where', { type: () => FindAccountTxHistoryArgs })
    where: FindAccountTxHistoryArgs,
  ): Promise<FindTransactionsHistoryResponseDto> {
    return this.apiGatewayService.findAccountTxHistory(where);
  }
}
