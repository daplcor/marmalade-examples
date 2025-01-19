  import { pactCalls, sendMintTransaction } from './kadena';
  import { magic } from '../wallet/magic';
  import config from './config';
  

    export const createMintId = async (precision, guard, policy, uri) => {
    const code = `(use marmalade-v2.ledger)
      (use marmalade-v2.util-v1)
      (create-token-id { 'precision: ${precision}, 'policies: (create-policies ${policy}), 'uri: "${uri}"} (read-keyset 'ks))`;
  
    return pactCalls(code, config.chainId, guard);
  };