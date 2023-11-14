export class GetTransfersByAccountArgs {
  limit: number;
  offset: number;
  blockNumber_gt: number;
  blockNumber_lt: number | null;
  publicKey: string;
  queryUrl: string;
}
