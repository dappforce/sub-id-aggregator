import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env.local` });

const queryUrl = process.env.DATA_SOURCE_GSQUID_MAIN_POLKADOT;
if (!queryUrl) throw new Error('Codegen error: Datahub Mutation URL not set');

const config: CodegenConfig = {
  overwrite: true,
  schema: queryUrl,
  documents: 'src/utils/graphQl/gsquidMain/query.ts',
  generates: {
    'src/utils/graphQl/gsquidMain/gsquid-main-query.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;
