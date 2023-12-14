import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtils {
  constructor() {}

  getStringEndingShortcut(str: string): string {
    return str.substring(str.length - 6, str.length - 1);
  }

  getTransferId({
    blockNumber,
    eventIndex,
  }: {
    blockNumber: number;
    eventIndex?: string | number;
  }) {
    return `${blockNumber}-${eventIndex}`;
  }
}
