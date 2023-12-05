import { Injectable } from '@nestjs/common';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, isHex, hexToU8a } from '@polkadot/util';
import { ethers } from 'ethers';

@Injectable()
export class CryptoUtils {
  constructor() {}

  addressToHex(address: string | Uint8Array) {
    const publicKey = decodeAddress(address);
    return u8aToHex(publicKey);
  }

  isValidAddress(maybeAddress: string) {
    if (
      this.isValidSubstrateAddress(maybeAddress) ||
      this.isValidEvmAddress(maybeAddress)
    )
      return true;
    return false;
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

  isValidEvmAddress(address: string) {
    return ethers.isAddress(address);
  }
}
