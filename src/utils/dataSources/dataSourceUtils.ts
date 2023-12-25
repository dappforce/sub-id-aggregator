import { Injectable } from '@nestjs/common';
import { GetTransfersByAccountArgs } from '../../modules/dataAggregator/dto/getTransfersByAccount.args.dto';
import { GetIndexerLastProcessedHeightArgs } from '../../modules/dataAggregator/dto/getIndexerLastProcessedHeight.args.dto';
import { DataSourceUtilsSubSquid } from './dataSourceUtils.subSquid';
import { DataSourceUtilsSubQuery } from './dataSourceUtils.subQuery';
import { DataSourceDecorators } from './dataSourceDecorators';
import { IndexerLastProcessedHeightDecoratedDto } from '../../modules/dataAggregator/dto/indexerLastProcessedHeightDecorated.dto';
import { TransfersByAccountDecoratedDto } from '../../modules/dataAggregator/dto/transfersByAccountDecorated.dto';
import { AppConfig } from '../../config.module';
import {
  DataSourceProviders,
  NativeTransactionKind,
} from '../../constants/common';
import { BlockchainTag } from '../../constants/blockchain';
import { EventsName } from '@subsocial/api/types';

@Injectable()
export class DataSourceUtils extends DataSourceDecorators {
  constructor(private appConfig: AppConfig) {
    super();
  }

  public subsSquid: DataSourceUtilsSubSquid = new DataSourceUtilsSubSquid();
  public subsQuery: DataSourceUtilsSubQuery = new DataSourceUtilsSubQuery();

  async getTransfersByAccount(
    data: GetTransfersByAccountArgs,
  ): Promise<TransfersByAccountDecoratedDto> {
    switch (this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER) {
      case DataSourceProviders.SUBSQUID:
        return this.decorateGetTransfersByAccountResponseFromSubSquid(
          await this.subsSquid.getTransfersByAccount({
            ...data,
            resultPlaceholder: {},
          }),
        );
      case DataSourceProviders.SUBQUERY:
        return this.decorateGetTransfersByAccountResponseFromSubQuery(
          await this.subsQuery.getTransfersByAccount({
            ...data,
            queryUrl: this.decorateQueryUrl(data.queryUrl as string),
            resultPlaceholder: { historyElements: { nodes: [] } },
          }),
        );
      default:
        new Error(
          `Valid DATA_SOURCE_PROVIDER_TRANSFERS has not been provided. [${this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER}]`,
        );
    }
  }

  async getIndexerLastProcessedHeight(
    data: GetIndexerLastProcessedHeightArgs,
  ): Promise<IndexerLastProcessedHeightDecoratedDto> {
    switch (this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER) {
      case DataSourceProviders.SUBSQUID:
        return this.decorateGetIndexerLastProcessedHeightFromSubSquid(
          await this.subsSquid.getIndexerLastProcessedHeight({
            ...data,
            resultPlaceholder: {},
          }),
        );
      case DataSourceProviders.SUBQUERY:
        return this.decorateGetIndexerLastProcessedHeightFromSubQuery(
          await this.subsQuery.getIndexerLastProcessedHeight({
            ...data,
            queryUrl: this.decorateQueryUrl(data.queryUrl as string),
            resultPlaceholder: { _metadata: { lastProcessedHeight: 0 } },
          }),
        );
      default:
        new Error(
          `Valid DATA_SOURCE_PROVIDER_TRANSFERS has not been provided. [${this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER}]`,
        );
    }
  }

  getQueryEndpoint(
    blockchainTag: BlockchainTag,
    eventName: NativeTransactionKind,
  ) {
    return this.appConfig[
      `DATA_SOURCE__${
        this.appConfig[`DATA_SOURCE_PROVIDER_${eventName}`]
      }__${blockchainTag}__${eventName}`
    ];
    // switch (
    //   this.appConfig[
    //     `DATA_SOURCE_PROVIDER_${eventName.toUpperCase()}`
    //   ] as DataSourceProviders
    // ) {
    //   case 'SUBSQUID':
    //     return this.appConfig[
    //       `DATA_SOURCE__${
    //         this.appConfig[`DATA_SOURCE_PROVIDER_${eventName}`]
    //       }__${blockchainTag}__${eventName}`
    //     ];
    //   case 'SUBQUERY':
    //     return this.subsQuery.getQueryEndpointApolloLinks(
    //       this.appConfig[
    //         `DATA_SOURCE__${
    //           this.appConfig[`DATA_SOURCE_PROVIDER_${eventName}`]
    //         }__${blockchainTag}__${eventName}`
    //       ],
    //     );
    // }
  }

  decorateQueryUrl(url: string) {
    switch (this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER) {
      // this.appConfig[
      //   `DATA_SOURCE_PROVIDER_${eventName.toUpperCase()}`
      // ] as DataSourceProviders
      case 'SUBQUERY':
        return this.subsQuery.getQueryEndpointApolloLinks(url);
      default:
        return url;
    }
  }

  getListWithoutDuplicates<T>(list: T[], filterByProp: keyof T): T[] {
    return [
      ...new Map<T[keyof T], T>(
        list.map((item) => [item[filterByProp], item]),
      ).values(),
    ];
  }
}
