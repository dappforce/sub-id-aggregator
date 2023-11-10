import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FindAccountTxHistoryArgs } from './dto/input/findTransactionsHistory.input.dto';
import { FindTransactionsHistoryResponseDto } from './dto/response/findTransactionsHistory.response.dto';
import { ApiGatewayService } from '../services/apiGateway.service';
import { EnqueueAccountAggregationJobInput } from '../../queueProcessor/dto/enqueueAccountAggregationJob.input';
import { AccountAggregationFlowProducer } from '../../queueProcessor/services/producers/accountAggregationFlow.producer';
import { RefreshTxHistoryResponseDto } from './dto/response/refreshTxHistory.response.dto';

@Resolver()
export class TransactionsHistoryResolver {
  constructor(
    private apiGatewayService: ApiGatewayService,
    private accountAggregationFlowProducer: AccountAggregationFlowProducer,
  ) {}

  @Query(() => FindTransactionsHistoryResponseDto)
  accountTxHistory(
    @Args('where', { type: () => FindAccountTxHistoryArgs })
    where: FindAccountTxHistoryArgs,
  ): Promise<FindTransactionsHistoryResponseDto> {
    return this.apiGatewayService.findAccountTxHistory(where);
  }

  // TODO testing mutation to emulate tasks adding by SubID back
  @Mutation(() => RefreshTxHistoryResponseDto)
  async refreshAccountTxHistory(
    @Args('args')
    args: EnqueueAccountAggregationJobInput,
  ): Promise<RefreshTxHistoryResponseDto> {
    await this.accountAggregationFlowProducer.enqueueTask(args);

    return { success: true };
  }
}
