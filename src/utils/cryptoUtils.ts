import { Injectable } from '@nestjs/common';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, isHex, hexToU8a } from '@polkadot/util';

@Injectable()
export class CryptoUtils {
  constructor() {}

  substrateAddressToHex(address: string | Uint8Array) {
    const publicKey = decodeAddress(address);
    return u8aToHex(publicKey);
  }

  isValidSubstrateAddress(address: string) {
    try {
      encodeAddress(
        isHex(address) ? hexToU8a(address) : decodeAddress(address),
      );
      return true;
    } catch (error) {
      return false;
    }
  }


}
