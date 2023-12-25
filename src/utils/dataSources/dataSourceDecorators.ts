import {
  GetIndexerLastProcessedHeightSubQueryQuery,
  GetTransfersByAccountSubQueryQuery,
} from '../graphQl/subQueryNova/subquery-nova-query';
import { TransfersByAccountDecoratedDto } from '../../modules/dataAggregator/dto/transfersByAccountDecorated.dto';
import { TransferDirection } from '../../constants/common';
import { CommonUtils } from '../commonUtils';
import { CryptoUtils } from '../cryptoUtils';
import { TransferDto } from '../graphQl/subQueryNova/transfer.dto';
import { IndexerLastProcessedHeightDecoratedDto } from '../../modules/dataAggregator/dto/indexerLastProcessedHeightDecorated.dto';
import {
  GetMainSquidStatusSubSquidQuery,
  GetTransfersByAccountSubSquidQuery,
} from '../graphQl/gsquidMain/gsquid-main-query';

export class DataSourceDecorators {
  private commonUtils: CommonUtils = new CommonUtils();
  private cryptoUtils: CryptoUtils = new CryptoUtils();

  getTransferDirection({
    from,
    to,
    address,
  }: {
    from: string;
    to: string;
    address: string;
  }): TransferDirection {
    if (address === from) return TransferDirection.FROM;
    return TransferDirection.TO;
  }

  decorateGetTransfersByAccountResponseFromSubQuery(
    queryResponse: GetTransfersByAccountSubQueryQuery,
  ): TransfersByAccountDecoratedDto {
    const decoratedData: TransfersByAccountDecoratedDto = {
      transfers: [],
    };

    for (const node of queryResponse.historyElements.nodes) {
      const transferData = node.transfer as TransferDto;
      decoratedData.transfers.push({
        id: this.commonUtils.getTransferId({
          blockNumber: node.blockNumber,
          eventIndex: transferData.eventIdx,
        }),
        direction: this.getTransferDirection({
          from: transferData.from,
          to: transferData.to,
          address: node.address,
        }),
        transfer: {
          id: this.commonUtils.getTransferId({
            blockNumber: node.blockNumber,
            eventIndex: transferData.eventIdx,
          }),
          amount: transferData.amount,
          fee: transferData.fee,
          blockNumber: node.blockNumber,
          extrinsicHash: node.extrinsicHash,
          eventIndex: transferData.eventIdx,
          success: transferData.success,
          timestamp: +node.timestamp * 1000,
          from: {
            publicKey: this.cryptoUtils.addressToHex(transferData.from),
          },
          to: { publicKey: this.cryptoUtils.addressToHex(transferData.to) },
        },
      });
    }
    return decoratedData;
  }

  decorateGetTransfersByAccountResponseFromSubSquid(
    queryResponse: GetTransfersByAccountSubSquidQuery,
  ) {
    const decoratedData: TransfersByAccountDecoratedDto = {
      transfers: [],
    };

    // for (const transfer of queryResponse.transfers) {
    //
    //   decoratedData.transfers.push({
    //     direction: this.getTransferDirection({
    //       from: transfer.transfer.from.publicKey,
    //       to: transfer.transfer.to.publicKey,
    //       address: node.address,
    //     }),
    //     transfer: {
    //       id: this.commonUtils.getTransferId({
    //         blockNumber: transfer.transfer.blockNumber,
    //         eventIndex: transfer.transfer.eventIdx,
    //       }),
    //       amount: transferData.amount,
    //       fee: 0,
    //       blockNumber: node.blockNumber,
    //       extrinsicHash: node.extrinsicHash,
    //       eventIndex: transferData.eventIdx,
    //       success: transferData.success,
    //       timestamp: node.timestamp,
    //       from: {
    //         publicKey: this.cryptoUtils.addressToHex(transferData.from),
    //       },
    //       to: { publicKey: this.cryptoUtils.addressToHex(transferData.to) },
    //     },
    //   });
    // }
    return decoratedData;
  }

  decorateGetIndexerLastProcessedHeightFromSubQuery(
    queryResponse: GetIndexerLastProcessedHeightSubQueryQuery,
  ): IndexerLastProcessedHeightDecoratedDto {
    return {
      height: +queryResponse._metadata.lastProcessedHeight,
    };
  }

  decorateGetIndexerLastProcessedHeightFromSubSquid(
    queryResponse: GetMainSquidStatusSubSquidQuery,
  ) {
    return {
      height: +queryResponse.squidStatus.height,
    };
  }
}
