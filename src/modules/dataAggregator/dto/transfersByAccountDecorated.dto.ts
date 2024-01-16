import { TransferDirection } from '../../../constants/common';

export type TransferDecoratedDto = {
  id: string;
  direction?: TransferDirection | null;
  transfer?: {
    id: string;
    amount: any;
    fee?: string;
    blockNumber: number;
    eventIndex?: number;
    extrinsicHash?: string | null;
    success: boolean;
    timestamp: any;
    from: { publicKey: string };
    to: { publicKey: string };
  } | null;
};

export type TransfersByAccountDecoratedDto = {
  transfers: TransferDecoratedDto[];
};
