import { ApolloDriver } from '@nestjs/apollo';
import GraphQLJSON from 'graphql-type-json';
import { Context } from 'apollo-server-core';
import { GqlModuleOptions } from '@nestjs/graphql/dist/interfaces/gql-module-options.interface';
import { GraphQLBigInt } from 'graphql-scalars';

export default {
  autoSchemaFile: './schema.gql',
  path: '/graphql',
  playground: true,
  driver: ApolloDriver,
  resolvers: { BigInt: GraphQLBigInt },
  // resolvers: { JSON: GraphQLJSON },
} as GqlModuleOptions;
