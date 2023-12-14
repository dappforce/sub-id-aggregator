import { Injectable } from '@nestjs/common';
import { GetTransfersByAccountArgs } from '../../modules/dataAggregator/dto/getTransfersByAccount.args.dto';
import { GetIndexerLastProcessedHeightArgs } from '../../modules/dataAggregator/dto/getIndexerLastProcessedHeight.args.dto';
import { DataSourceUtilsSubSquid } from './dataSourceUtils.subSquid';
import { DataSourceUtilsSubQuery } from './dataSourceUtils.subQuery';
import { DataSourceDecorators } from './dataSourceDecorators';
import { IndexerLastProcessedHeightDecoratedDto } from '../../modules/dataAggregator/dto/indexerLastProcessedHeightDecorated.dto';
import { TransfersByAccountDecoratedDto } from '../../modules/dataAggregator/dto/transfersByAccountDecorated.dto';
import { AppConfig } from '../../config.module';
import { DataSourceProviders } from '../../constants/common';

@Injectable()
export class DataSourceUtils extends DataSourceDecorators {
  constructor(private appConfig: AppConfig) {
    super();
  }

  private subsSquid: DataSourceUtilsSubSquid = new DataSourceUtilsSubSquid();
  private subsQuery: DataSourceUtilsSubQuery = new DataSourceUtilsSubQuery();

  async getTransfersByAccount(
    data: GetTransfersByAccountArgs,
  ): Promise<TransfersByAccountDecoratedDto> {
    switch (this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER) {
      case DataSourceProviders.SUBSQUID:
        return this.decorateGetTransfersByAccountResponseFromSubSquid(
          await this.subsSquid.getTransfersByAccount(data),
        );
      case DataSourceProviders.SUBQUERY:
        return this.decorateGetTransfersByAccountResponseFromSubQuery(
          await this.subsQuery.getTransfersByAccount(data),
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
          await this.subsSquid.getIndexerLastProcessedHeight(data),
        );
      case DataSourceProviders.SUBQUERY:
        return this.decorateGetIndexerLastProcessedHeightFromSubQuery(
          await this.subsQuery.getIndexerLastProcessedHeight(data),
        );
      default:
        new Error(
          `Valid DATA_SOURCE_PROVIDER_TRANSFERS has not been provided. [${this.appConfig.DATA_SOURCE_PROVIDER_TRANSFER}]`,
        );
    }
  }
}
