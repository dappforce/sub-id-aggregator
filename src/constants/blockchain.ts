import { NativeTransactionKind } from './common';
import { Blockchain } from '../modules/entities/blockchain/entities/blockchain.entity';

export enum BlockchainTag {
  POLKADOT = 'POLKADOT',
  KUSAMA = 'KUSAMA',
  MOONBEAM = 'MOONBEAM',
  MOONRIVER = 'MOONRIVER',
  ASTAR = 'ASTAR',
}

// https://github.com/polkadot-js/apps/blob/7c12692ee34aadd815b282ff4dca3d0a4763a9ca/packages/apps-config/src/endpoints/productionRelayPolkadot.ts#L645

export const supportedBlockchainDetails: Omit<Blockchain, 'id'>[] = [
  {
    text: 'Astar',
    info: 'astar',
    tag: BlockchainTag.ASTAR,
    decimal: 10,
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    text: 'Polkadot',
    info: 'polkadot',
    tag: BlockchainTag.POLKADOT,
    decimal: 10,
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    text: 'Kusama',
    info: 'kusama',
    tag: BlockchainTag.KUSAMA,
    decimal: 10,
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    text: 'Moonbeam',
    info: 'moonbeam',
    tag: BlockchainTag.MOONBEAM,
    decimal: 10,
    logo: '',
    color: '#1b6dc1d9',
  },
  {
    text: 'Moonriver',
    info: 'moonriver',
    tag: BlockchainTag.MOONRIVER,
    decimal: 10,
    logo: '',
    color: '#1b6dc1d9',
  },
];

export const blockchainDataSourceConfigs = [
  {
    tag: BlockchainTag.POLKADOT,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-polkadot/graphql',
      // [NativeTransactionKind.REWARD]:
      //   'https://squid.subsquid.io/gs-main-polkadot/graphql',
    },
  },
  {
    tag: BlockchainTag.KUSAMA,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-kusama/graphql',
      // [NativeTransactionKind.REWARD]:
      //   'https://squid.subsquid.io/gs-main-kusama/graphql',
    },
  },
  {
    tag: BlockchainTag.MOONBEAM,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-moonbeam/graphql',
      // [NativeTransactionKind.REWARD]:
      //   'https://squid.subsquid.io/gs-main-moonbeam/graphql',
    },
  },
  {
    tag: BlockchainTag.MOONRIVER,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-moonriver/graphql',
      // [NativeTransactionKind.REWARD]:
      //   'https://squid.subsquid.io/gs-main-moonriver/graphql',
    },
  },
  {
    tag: BlockchainTag.ASTAR,
    events: {
      [NativeTransactionKind.TRANSFER]:
        'https://squid.subsquid.io/gs-main-astar/graphql',
      // [NativeTransactionKind.REWARD]:
      //   'https://squid.subsquid.io/gs-main-astar/graphql',
    },
  },
] as const;
