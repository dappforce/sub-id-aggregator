import { Injectable } from '@nestjs/common';
import { FindAccountTxHistoryArgs } from '../gql/dto/input/findTransactionsHistory.input.dto';
import { FindTransactionsHistoryResponseDto } from '../gql/dto/response/findTransactionsHistory.response.dto';
import { DataAggregatorService } from '../../dataAggregator/services/dataAggregator.service';
import { AccountTransactionService } from '../../entities/accountTransaction/accountTransaction.service';

@Injectable()
export class ApiGatewayService {
  constructor(
    private dataAggregatorService: DataAggregatorService,
    private accountTransactionService: AccountTransactionService,
  ) {}

  async findAccountTxHistory(
    where: FindAccountTxHistoryArgs,
  ): Promise<FindTransactionsHistoryResponseDto> {
    const [data, total] =
      await this.accountTransactionService.findAccountTxHistory(where);

    return {
      data,
      total,
      offset: where.offset,
      pageSize: where.pageSize,
    };
  }
}
