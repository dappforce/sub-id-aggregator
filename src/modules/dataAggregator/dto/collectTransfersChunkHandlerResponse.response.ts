import { GetTransfersByAccountQuery } from '../../../utils/graphQl/gsquidMain/gsquid-main-query';

export class CollectTransfersChunkHandlerResponseResponse {
  fetchedChunkData: GetTransfersByAccountQuery['transfers'];
}
