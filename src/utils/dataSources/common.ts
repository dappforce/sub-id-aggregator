import { GraphQLClient, RequestOptions, Variables } from 'graphql-request';

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
}
