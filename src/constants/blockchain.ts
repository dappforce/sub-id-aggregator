import { NativeTransactionKind } from './common';
import { Blockchain } from '../modules/entities/blockchain/entities/blockchain.entity';

export enum BlockchainTag {
  POLKADOT = 'POLKADOT',
  KUSAMA = 'KUSAMA',
  MOONBEAM = 'MOONBEAM',
  MOONRIVER = 'MOONRIVER',
  ASTAR = 'ASTAR',
  SUBSOCIAL = 'SUBSOCIAL',
}
// https://github.com/polkadot-js/apps/blob/7c12692ee34aadd815b282ff4dca3d0a4763a9ca/packages/apps-config/src/endpoints/productionRelayPolkadot.ts#L645

// https://github.com/paritytech/ss58-registry/blob/main/ss58-registry.json

export const supportedBlockchainDetails: Omit<Blockchain, 'id'>[] = [
  {
    prefix: 5,
    text: 'Astar',
    info: 'astar',
    tag: BlockchainTag.ASTAR,
    decimal: 18,
    symbols: ['ASTR'],
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    prefix: 0,
    text: 'Polkadot',
    info: 'polkadot',
    tag: BlockchainTag.POLKADOT,
    decimal: 10,
    symbols: ['DOT'],
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    prefix: 2,
    text: 'Kusama',
    info: 'kusama',
    tag: BlockchainTag.KUSAMA,
    decimal: 12,
    symbols: ['KSM'],
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    prefix: 1284,
    text: 'Moonbeam',
    info: 'moonbeam',
    tag: BlockchainTag.MOONBEAM,
    decimal: 10,
    symbols: ['GLMR'],
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    prefix: 1285,
    text: 'Moonriver',
    info: 'moonriver',
    tag: BlockchainTag.MOONRIVER,
    decimal: 18,
    symbols: ['MOVR'],
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    prefix: 28,
    text: 'Subsocial',
    info: 'subsocial',
    tag: BlockchainTag.SUBSOCIAL,
    decimal: 10,
    symbols: ['SUB'],
    logo: '',
    color: '#1b6dc1d9',
  },
];

export const blockchainDataSourceConfigs = [
  // {
  //   tag: BlockchainTag.POLKADOT,
  //   events: {
  //     [NativeTransactionKind.TRANSFER]: null,
  //     // [NativeTransactionKind.REWARD]: null,
  //   },
  // },
  // {
  //   tag: BlockchainTag.KUSAMA,
  //   events: {
  //     [NativeTransactionKind.TRANSFER]: null,
  //     // [NativeTransactionKind.REWARD]: null,
  //   },
  // },
  // {
  //   tag: BlockchainTag.MOONBEAM,
  //   events: {
  //     [NativeTransactionKind.TRANSFER]: null,
  //     // [NativeTransactionKind.REWARD]: null,
  //   },
  // },
  // {
  //   tag: BlockchainTag.MOONRIVER,
  //   events: {
  //     [NativeTransactionKind.TRANSFER]: null,
  //     // [NativeTransactionKind.REWARD]: null,
  //   },
  // },
  // {
  //   tag: BlockchainTag.ASTAR,
  //   events: {
  //     [NativeTransactionKind.TRANSFER]: null,
  //     // [NativeTransactionKind.REWARD]: null,
  //   },
  // },
  {
    tag: BlockchainTag.SUBSOCIAL,
    events: {
      [NativeTransactionKind.TRANSFER]: null,
      // [NativeTransactionKind.REWARD]: null,
    },
  },
] as const;
