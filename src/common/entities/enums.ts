import { registerEnumType } from '@nestjs/graphql';

export enum DataType {
  test = 'test',
}

registerEnumType(DataType, {
  name: 'DataType',
});
