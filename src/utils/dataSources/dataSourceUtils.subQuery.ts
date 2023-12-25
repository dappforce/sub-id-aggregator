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
import { deploymentHttpLink } from '@subql/apollo-links';

// @Injectable()
export class DataSourceUtilsSubQuery extends CommonDataSourceUtils {
  private cryptoUtils: CryptoUtils = new CryptoUtils();

  async getTransfersByAccount(data: GetTransfersByAccountArgs) {
    let res = data.resultPlaceholder;

    try {
      res = await this.indexerQueryRequestApolloClient<
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
      );
    } catch (e) {
      console.log(e);
    }

    return res;
  }

  async getIndexerLastProcessedHeight(data: GetIndexerLastProcessedHeightArgs) {
    let res = data.resultPlaceholder;

    try {
      res = this.indexerQueryRequestApolloClient<
        GetIndexerLastProcessedHeightSubQueryQuery,
        {}
      >(
        {
          document: GET_INDEXER_LAST_PROCESSED_HEIGHT,
          variables: {},
        },
        data.queryUrl,
      );
    } catch (e) {
      console.log(e);
    }

    return res;
  }

  getQueryEndpointApolloLinks(deploymentId: string) {
    const options = {
      authUrl: 'https://kepler-auth.subquery.network', // this is for testnet, use https://kepler-auth.subquery.network for kepler
      deploymentId: deploymentId,
      httpOptions: { fetchOptions: { timeout: 5000 } },
      maxRetries: 30,
      logger: console, // or any other custom logger
    };

    const { link, cleanup } = deploymentHttpLink(options);

    return link;
  }
}
