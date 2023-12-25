import { GraphQLClient, RequestOptions, Variables } from 'graphql-request';
import {
  ApolloClient,
  ApolloLink,
  ApolloQueryResult,
  InMemoryCache,
} from '@apollo/client/core';
import { ApolloClientOptions } from '@apollo/client/core/ApolloClient';
import { OperationVariables } from '@apollo/client/core/types';
import type { DocumentNode } from 'graphql';

export class CommonDataSourceUtils {
  constructor() {}

  async requestWithRetry<T>(
    requestPromise: Promise<T>,
    { retries = 3, everyMs = 1_000 },
    retriesCount = 0,
  ): Promise<T> {
    try {
      return await requestPromise;
    } catch (e) {
      const updatedCount = retriesCount + 1;
      if (updatedCount > retries) {
        throw Error((e as Error).message);
      }
      await new Promise((resolve) => setTimeout(resolve, everyMs));
      return await this.requestWithRetry<T>(
        requestPromise,
        { retries, everyMs },
        updatedCount,
      );
    }
  }

  indexerQueryRequest<T, V extends Variables = Variables>(
    config: RequestOptions<V, T>,
    queryUrl: string,
  ) {
    if (!queryUrl) throw new Error('queryUrl is not provided');

    const TIMEOUT = 2 * 60 * 1000;
    const client = new GraphQLClient(queryUrl, {
      timeout: TIMEOUT,
      ...config,
    });
    return client.request({ queryUrl, ...config });
  }

  async indexerQueryRequestApolloClient<
    T,
    V extends OperationVariables = OperationVariables,
  >(
    config: { variables: V; document: DocumentNode },
    queryUrl: string | ApolloLink,
  ): Promise<T> {
    if (!queryUrl) throw new Error('queryUrlOrLinks is not provided');

    const options: ApolloClientOptions<any> = {
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
        },
        query: {
          fetchPolicy: 'no-cache',
        },
      },
    };

    if (typeof queryUrl === 'string') {
      options.uri = queryUrl;
    } else {
      options.link = queryUrl;
    }

    const client = new ApolloClient(options);

    return (
      await client.query<T, V>({
        query: config.document,
        variables: config.variables,
        fetchPolicy: 'no-cache',
      })
    ).data;
  }

}
