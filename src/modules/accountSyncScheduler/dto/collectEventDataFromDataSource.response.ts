import { NativeTransactionKind } from '../../../constants/common';

export class CollectEventDataFromDataSourceResponse {
  event: NativeTransactionKind;
  success: boolean;
}
