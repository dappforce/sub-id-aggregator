import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env.local` });

const queryUrl = process.env.DATA_SOURCE_SUBQUERY_NOVA_POLKADOT;
if (!queryUrl) throw new Error('Codegen error: Datahub Mutation URL not set');

const config: CodegenConfig = {
  overwrite: true,
  schema: queryUrl,
  documents: 'src/utils/graphQl/subQueryNova/query.ts',
  generates: {
    'src/utils/graphQl/subQueryNova/subquery-nova-query.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
};

export default config;
