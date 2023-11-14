import { Injectable } from '@nestjs/common';
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request';
import {
  GET_MAIN_SQUID_STATUS,
  GET_TRANSFERS_BY_ACCOUNT,
  GET_TRANSFERS_COUNT_BY_ACCOUNT,
} from './graphQl/gsquidMain/query';
import {
  GetMainSquidStatusQuery,
  GetTransfersByAccountQuery,
  GetTransfersCountByAccountQuery,
  QueryTransfersArgs,
  QueryTransfersConnectionArgs,
  Transfer,
  TransferOrderByInput,
} from './graphQl/gsquidMain/gsquid-main-query';
import { GetTransfersByAccountArgs } from '../modules/dataAggregator/dto/getTransfersByAccount.args.dto';
import { GetTransfersCountByAccountArgs } from '../modules/dataAggregator/dto/getTransfersCountByAccount.args.dto';
import { GetMainGiantSquidStatusArgs } from '../modules/dataAggregator/dto/getMainGiantSquidStatus.args.dto';

@Injectable()
export class DataSourceUtils {
  // private graphQLClient: GraphQLClient;

  constructor() {}

  squidQueryRequest<T, V extends Variables = Variables>(
    config: RequestOptions<V, T>,
    queryUrl: string,
  ) {
    if (!queryUrl) throw new Error('queryUrl is not provided');

    const TIMEOUT = 60 * 1000; // 10 seconds
    const client = new GraphQLClient(queryUrl, {
      timeout: TIMEOUT,
      ...config,
    });
    return client.request({ queryUrl, ...config });
  }

  async getTransfersByAccount(data: GetTransfersByAccountArgs) {
    const res = await this.squidQueryRequest<
      GetTransfersByAccountQuery,
      QueryTransfersArgs
    >(
      {
        document: GET_TRANSFERS_BY_ACCOUNT,
        variables: {
          limit: data.limit,
          offset: data.offset,
          // orderBy: [TransferOrderByInput.TransferTimestampAsc],
          where: {
            account: { publicKey_eq: data.publicKey },
            transfer: {
              blockNumber_gt: data.blockNumber_gt,
              ...(data.blockNumber_lt
                ? { blockNumber_lt: data.blockNumber_lt }
                : {}),
            },
          },
        },
      },
      data.queryUrl,
    );
    return res;
  }

  async getTransfersCountByAccount(data: GetTransfersCountByAccountArgs) {
    const res = await this.squidQueryRequest<
      GetTransfersCountByAccountQuery,
      QueryTransfersConnectionArgs
    >(
      {
        document: GET_TRANSFERS_COUNT_BY_ACCOUNT,
        variables: {
          orderBy: [TransferOrderByInput.IdAsc],
          where: {
            account: { publicKey_eq: data.publicKey },
            transfer: {
              blockNumber_gt: data.blockNumber_gt,
            },
          },
        },
      },
      data.queryUrl,
    );
    return res;
  }

  async getMainGiantSquidStatus(data: GetMainGiantSquidStatusArgs) {
    const res = await this.squidQueryRequest<GetMainSquidStatusQuery, {}>(
      {
        document: GET_MAIN_SQUID_STATUS,
        variables: {},
      },
      data.queryUrl,
    );
    return res;
  }
}
