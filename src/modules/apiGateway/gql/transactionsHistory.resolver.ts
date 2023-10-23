import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FindAccountTxHistoryArgs } from './dto/input/findTransactionsHistory.input.dto';
import { FindTransactionsHistoryResponseDto } from './dto/response/findTransactionsHistory.response.dto';
import { ApiGatewayService } from '../services/apiGateway.service';
import { EnqueueAccountAggregationJobInput } from '../../queueProcessor/dto/enqueueAccountAggregationJob.input';
import { AccountAggregationFlowProducer } from '../../queueProcessor/services/producers/accountAggregationFlow.producer';

@Resolver()
export class TransactionsHistoryResolver {
  constructor(
    private apiGatewayService: ApiGatewayService,
    private accountAggregationFlowProducer: AccountAggregationFlowProducer,
  ) {}

  @Query(() => String)
  accountTxHistory(
    @Args('where', { type: () => FindAccountTxHistoryArgs })
    where: FindAccountTxHistoryArgs,
  ): Promise<FindTransactionsHistoryResponseDto> {
    return this.apiGatewayService.findAccountTxHistory(where);
  }

  @Mutation(() => String)
  refreshAccountTxHistory(
    @Args('args')
    args: EnqueueAccountAggregationJobInput,
  ): Promise<void> {
    return this.accountAggregationFlowProducer.enqueueTask(args);
  }
}
