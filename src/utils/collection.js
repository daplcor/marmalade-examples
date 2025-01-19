import { pactCalls, sendCollectionTransaction } from './kadena';
import { magic } from '../wallet/magic';
import config from './config';

  export const createCollection = async (name, size, account, guard) => {
    
    const collectionId = await createCollectionId(name, guard);
    if (!collectionId?.result?.data) {
      throw new Error('Failed to generate collection ID');
    }
  
    const code = `(use marmalade-v2.collection-policy-v1)
      (create-collection ${JSON.stringify(collectionId.result.data)}
                        ${JSON.stringify(name)}
                        ${size}
                        (read-keyset 'ks)) ${JSON.stringify(collectionId.result.data)}`;
  
    return sendCollectionTransaction(code, config.chainId, magic, account, guard);
  };

export const createCollectionId = async (name, guard) => {
  const code = `(use marmalade-v2.collection-policy-v1)
    (create-collection-id ${JSON.stringify(name)} (read-keyset 'ks))`;

  return pactCalls(code, config.chainId, guard);
};