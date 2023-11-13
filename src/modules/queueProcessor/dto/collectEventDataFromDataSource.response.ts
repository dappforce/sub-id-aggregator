import { NativeTransactionKind } from '../../../constants/common';
import { CollectEventDataFromDataSourceInput } from './collectEventDataFromDataSource.input';
import { CollectEventDataHandlerResponse } from '../../dataAggregator/dto/collectEventDataHandler.response';

export class CollectEventDataFromDataSourceResponse {
  jobResult: CollectEventDataHandlerResponse;
  requestData: CollectEventDataFromDataSourceInput;
}
