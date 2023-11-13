import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtils {
  constructor() {}

  getStringShortcut(publicKey: string): string {
    return publicKey.substring(publicKey.length - 6, publicKey.length - 1);
  }
}
