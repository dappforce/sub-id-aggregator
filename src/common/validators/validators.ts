import { encodeAddress, decodeAddress } from '@polkadot/keyring';
import { isHex, hexToU8a } from '@polkadot/util';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { AppModule } from '../../app.module';
import { CryptoUtils } from '../../utils/cryptoUtils';

function isValidSubstrateAddress(address: string) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
}

export function IsValidSubstrateAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidAddressSubstrateAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const cryptoUtils = new CryptoUtils();
          return (
            typeof value === 'string' &&
            cryptoUtils.isValidSubstrateAddress(value)
          );
        },
      },
    });
  };
}
