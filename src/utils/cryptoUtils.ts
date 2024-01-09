import { Injectable } from '@nestjs/common';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, u8aToString, isHex, hexToU8a } from '@polkadot/util';
import { ethers } from 'ethers';
import {
  BlockchainTag,
  supportedBlockchainDetails,
} from '../constants/blockchain';

@Injectable()
export class CryptoUtils {
  private supportedBlockchainDetailsMap = new Map(
    supportedBlockchainDetails.map((data) => [data.tag, data]),
  );
  constructor() {}

  addressToHex(address: string | Uint8Array) {
    const publicKey = decodeAddress(address);
    return u8aToHex(publicKey);
  }

  addressToHexIfNotHex(address: string | Uint8Array) {
    if (
      this.isValidEvmAddress(
        typeof address === 'string' ? address : u8aToString(address),
      )
    )
      return typeof address === 'string' ? address : u8aToString(address);
    return this.addressToHex(address);
  }

  publicKeyToFormattedAddress(publicKey: string, blockchainTag: BlockchainTag) {
    console.log('publicKeyToFormattedAddress - ', publicKey);
    if (this.isValidEvmAddress(publicKey)) return publicKey;
    return encodeAddress(
      decodeAddress(publicKey),
      this.supportedBlockchainDetailsMap.get(blockchainTag).prefix,
    );
  }

  decoratePublicKey(publicKey: string) {
    console.log('publicKeyToFormattedAddress - ', publicKey);
    if (this.isValidEvmAddress(publicKey)) return publicKey.toLowerCase();
    return publicKey;
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
