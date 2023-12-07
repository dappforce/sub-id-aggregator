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
    @Args('args', { type: () => FindAccountTxHistoryArgs })
    args: FindAccountTxHistoryArgs,
  ): Promise<FindTransactionsHistoryResponseDto> {
    return this.apiGatewayService.findAccountTxHistory(args);
  }

  // TODO testing mutation to emulate tasks adding by SubID back
  @Mutation(() => RefreshTxHistoryResponseDto)
  async refreshAccountTxHistory(
    @Args('args')
    args: EnqueueAccountAggregationJobInput,
  ): Promise<RefreshTxHistoryResponseDto> {
    await this.accountAggregationFlowProducer.enqueueTask({
      ...args,
      jobOptions: { ...args, priority: 1 },
    });

    return { success: true };
  }
}
