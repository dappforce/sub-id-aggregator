import { Injectable } from '@nestjs/common';
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request';
import {
  GET_MAIN_SQUID_STATUS_SUBSQUID,
  GET_TRANSFERS_BY_ACCOUNT_SUBSQUID,
  GET_TRANSFERS_COUNT_BY_ACCOUNT_SUBSQUID,
} from '../graphQl/gsquidMain/query';
import {
  GetMainSquidStatusSubSquidQuery,
  GetTransfersByAccountSubSquidQuery,
  GetTransfersCountByAccountSubSquidQuery,
  QueryTransfersArgs,
  QueryTransfersConnectionArgs,
  Transfer,
  TransferOrderByInput,
} from '../graphQl/gsquidMain/gsquid-main-query';
import { GetTransfersByAccountArgs } from '../../modules/dataAggregator/dto/getTransfersByAccount.args.dto';
import { GetTransfersCountByAccountArgs } from '../../modules/dataAggregator/dto/getTransfersCountByAccount.args.dto';
import { GetIndexerLastProcessedHeightArgs } from '../../modules/dataAggregator/dto/getIndexerLastProcessedHeight.args.dto';
import { CommonDataSourceUtils } from './common';

// @Injectable()
export class DataSourceUtilsSubSquid extends CommonDataSourceUtils {
  // private graphQLClient: GraphQLClient;

  async getTransfersByAccount(data: GetTransfersByAccountArgs) {
    // console.log(
    //   `request started :: ${data.blockNumber_gt}/${data.blockNumber_lt}`,
    // );
    const res = await this.requestWithRetry<GetTransfersByAccountSubSquidQuery>(
      this.indexerQueryRequest<
        GetTransfersByAccountSubSquidQuery,
        QueryTransfersArgs
      >(
        {
          document: GET_TRANSFERS_BY_ACCOUNT_SUBSQUID,
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
      ),
      { retries: 5, everyMs: 1_500 },
    );
    return res;
  }

  // async getTransfersCountByAccount(data: GetTransfersCountByAccountArgs) {
  //   const res = await this.indexerQueryRequest<
  //     GetTransfersCountByAccountQuery,
  //     QueryTransfersConnectionArgs
  //   >(
  //     {
  //       document: GET_TRANSFERS_COUNT_BY_ACCOUNT_SUBSQUID,
  //       variables: {
  //         orderBy: [TransferOrderByInput.IdAsc],
  //         where: {
  //           account: { publicKey_eq: data.publicKey },
  //           transfer: {
  //             blockNumber_gt: data.blockNumber_gt,
  //           },
  //         },
  //       },
  //     },
  //     data.queryUrl,
  //   );
  //   return res;
  // }

  async getIndexerLastProcessedHeight(data: GetIndexerLastProcessedHeightArgs) {
    const res = await this.indexerQueryRequest<
      GetMainSquidStatusSubSquidQuery,
      {}
    >(
      {
        document: GET_MAIN_SQUID_STATUS_SUBSQUID,
        variables: {},
      },
      data.queryUrl,
    );
    return res;
  }
}
