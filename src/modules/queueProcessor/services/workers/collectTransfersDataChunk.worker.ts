import { Job, DoneCallback } from 'bull';
import { GetTransfersByAccountQuery } from '../../../../utils/graphQl/gsquidMain/gsquid-main-query';
import { DataSourceUtils } from '../../../../utils/dataSourceUtils';
import crypto from 'node:crypto';

export default async function (job: Job, cb: DoneCallback) {
  try {
    const randomDelay = 500 + crypto.randomInt(3000);
    await new Promise((res, rej) => setTimeout(res, randomDelay));
    console.log(
      `[${process.pid}] :: ${job.data.blockchainTag}::${job.data.chunkStartBlock}/${job.data.chunkEndBlock} :: process delay ${randomDelay}ms`,
    );

    const inputData = job.data;
    const dataSourceUtils = new DataSourceUtils();

    const responseBuffer: GetTransfersByAccountQuery['transfers'] = [];
    let index = 1;

    const runQuery = async (offset: number = 0) => {
      const currentOffset = offset;
      console.log(
        `runQuery started :: ${inputData.blockchainTag} :: ${
          inputData.chunkStartBlock
        }/${inputData.chunkEndBlock} :: index ${index} :: offset ${
          currentOffset + pageSize
        }`,
      );

      const resp = await dataSourceUtils.getTransfersByAccount({
        limit: pageSize,
        offset: currentOffset,
        publicKey: inputData.publicKey,
        blockNumber_gt: inputData.chunkStartBlock,
        blockNumber_lt: inputData.chunkEndBlock,
        queryUrl: inputData.sourceUrl,
      });
      if (resp.transfers.length === 0) return;
      responseBuffer.push(...resp.transfers);

      console.log(
        `runQuery completed :: ${inputData.blockchainTag} :: ${
          inputData.chunkStartBlock
        }/${inputData.chunkEndBlock} :: index ${index} :: offset ${
          currentOffset + pageSize
        }`,
      );
      index++;
      await runQuery(currentOffset + pageSize);
    };
    const pageSize = 1000;
    await runQuery();

    cb(null, JSON.stringify({ fetchedChunkData: responseBuffer }));
  } catch (e) {
    console.log(e);
    cb(e as Error, JSON.stringify({ fetchedChunkData: [] }));
  }
}
