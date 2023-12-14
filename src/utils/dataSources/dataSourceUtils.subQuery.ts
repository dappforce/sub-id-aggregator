import { Injectable } from '@nestjs/common';
import { GetTransfersByAccountArgs } from '../../modules/dataAggregator/dto/getTransfersByAccount.args.dto';
import { GetTransfersCountByAccountArgs } from '../../modules/dataAggregator/dto/getTransfersCountByAccount.args.dto';
import { GetIndexerLastProcessedHeightArgs } from '../../modules/dataAggregator/dto/getIndexerLastProcessedHeight.args.dto';
import { CommonDataSourceUtils } from './common';
import {
  GET_INDEXER_LAST_PROCESSED_HEIGHT,
  GET_TRANSFERS_BY_ACCOUNT_SUBQUERY,
} from '../graphQl/subQueryNova/query';
import {
  GetIndexerLastProcessedHeightSubQueryQuery,
  GetTransfersByAccountSubQueryQuery,
  GetTransfersByAccountSubQueryQueryVariables,
} from '../graphQl/subQueryNova/subquery-nova-query';
import { CryptoUtils } from '../cryptoUtils';

// @Injectable()
export class DataSourceUtilsSubQuery extends CommonDataSourceUtils {
  private cryptoUtils: CryptoUtils = new CryptoUtils();

  async getTransfersByAccount(data: GetTransfersByAccountArgs) {
    const res = await this.requestWithRetry<GetTransfersByAccountSubQueryQuery>(
      this.indexerQueryRequest<
        GetTransfersByAccountSubQueryQuery,
        GetTransfersByAccountSubQueryQueryVariables
      >(
        {
          document: GET_TRANSFERS_BY_ACCOUNT_SUBQUERY,
          variables: {
            offset: data.offset,
            first: data.limit,
            // orderBy: [TransferOrderByInput.TransferTimestampAsc],
            filter: {
              address: {
                equalTo: this.cryptoUtils.publicKeyToFormattedAddress(
                  data.publicKey,
                  data.blockchainTag,
                ),
              },
              blockNumber: {
                greaterThan: data.blockNumber_gt,
                ...(data.blockNumber_lt
                  ? { lessThan: data.blockNumber_lt }
                  : {}),
              },
              transfer: { isNull: false },
            },
          },
        },
        data.queryUrl,
      ),
      { retries: 5, everyMs: 1_500 },
    );
    return res;
  }

  async getIndexerLastProcessedHeight(data: GetIndexerLastProcessedHeightArgs) {
    const res =
      await this.requestWithRetry<GetIndexerLastProcessedHeightSubQueryQuery>(
        this.indexerQueryRequest<
          GetIndexerLastProcessedHeightSubQueryQuery,
          {}
        >(
          {
            document: GET_INDEXER_LAST_PROCESSED_HEIGHT,
            variables: {},
          },
          data.queryUrl,
        ),
        { retries: 5, everyMs: 1_500 },
      );
    return res;
  }
}
