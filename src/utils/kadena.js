import { Pact, createClient } from "@kadena/client";
import config from "./config";
import { magic } from "../wallet/magic";
import { createMintId } from "./mint";

const network = config.networkId;
const api = config.apiUrl;

export const pactCalls = async (code, chain, guard) => {
  const pactClient = createClient(
    `${api}/chainweb/0.0/${network}/chain/${chain}/pact`
  );

  const tx = Pact.builder
    .execution(code)
    .setMeta({
      chainId: String(chain),
      gasLimit: 80000,
      gasPrice: 0.0000001,
    })
    .addData("ks", { keys: guard.keys, pred: guard.pred })
    .setNetworkId(network)
    .createTransaction();
  console.log("tx", tx);
  try {
    const res = await pactClient.dirtyRead(tx);
    console.log(res);
    return res;
  } catch {
    console.error("Error in pact Call:", error);
    return null;
  }
};

// Options we use for debouncedPolicies are
// DEFAULT_COLLECTION_NON_UPDATABLE, DEFAULT_COLLECTION_ROYALTY_NON_UPDATABLE
export const mint = async (
  envData,
  account,
  guard,
  mintTo,
  royalties = 0,
  royaltyRecipient = null
) => {
  const policy =
    royalties > 0
      ? "DEFAULT_COLLECTION_ROYALTY_NON_UPDATABLE"
      : "DEFAULT_COLLECTION_NON_UPDATABLE";
  const precision = 0;
  const tokenId = await createMintId(precision, guard, policy, envData.uri);
  if (!tokenId?.result?.data) {
    throw new Error("Failed to generate Mint ID");
  }
  const tId = tokenId.result.data;
  const code = `(use marmalade-v2.ledger)
      (use marmalade-v2.util-v1)
      (create-token ${JSON.stringify(
        tId
      )} ${precision} (read-msg 'uri) (create-policies ${policy}) (read-keyset 'ks)) (mint ${JSON.stringify(tId)} (read-msg 'mintTo) (at 'guard (coin.details (read-msg 'mintTo))) 1.0)`;

  return sendMintTransaction(
    code,
    config.chainId,
    magic,
    account,
    guard,
    envData,
    tId,
    mintTo,
    royalties > 0 ? royaltyRecipient : null,
    royalties
  );
};

export const sendMintTransaction = async (
  code,
  chain,
  magic,
  account,
  guard,
  envData,
  tId,
  mintTo,
  royaltyRecipient,
  royalties
) => {
  console.log("maic", magic);
  const pactClient = createClient(
    `${api}/chainweb/0.0/${network}/chain/${chain}/pact`
  );
  console.log("envData", envData);
  const k = {
    keys: [...guard.keys],
    pred: guard.pred,
  };

  const tx = Pact.builder
    .execution(code)
    .addSigner(
      {
        pubKey: guard.keys[0],
        scheme: "WebAuthn",
      },
      (signFor) => [
        signFor("coin.GAS"),
        signFor("marmalade-v2.ledger.MINT", tId, mintTo, { decimal: "1.0" }),
        signFor("marmalade-v2.ledger.CREATE-TOKEN", tId, k),
        signFor(
          "marmalade-v2.collection-policy-v1.TOKEN-COLLECTION",
          envData.collection_id,
          tId
        ),
      ]
    )
    .setMeta({
      chainId: String(chain),
      gasLimit: 10000,
      gasPrice: 0.0000001,
      sender: account,
    })
    .setNetworkId(network)
    .addKeyset("ks", guard.pred, ...guard.keys)
    .addData("uri", envData.uri)
    .addData("mintTo", mintTo)
    .addData("collection_id", envData.collection_id);
  if (royalties > 0) {
    tx.addData("royaltyData", {
      royalty: royalties / 100,
      recipient: royaltyRecipient,
    });
  }

  const transaction = tx.createTransaction();
  console.log("transaction", transaction);
  try {
    const { transactions } = await magic.kadena.signTransactionWithSpireKey(
      transaction
    );
    const signedTx = transactions[0];

    const preflightResult = await pactClient.preflight(signedTx);
    console.log("preflightResult", preflightResult);
    if (preflightResult.result.status === "failure") {
      return { preflightResult };
    }

    const transactionDescriptor = await pactClient.submit(signedTx);
    return { pactClient, transactionDescriptor, preflightResult };
  } catch (error) {
    throw error;
  }
};

export const sendCollectionTransaction = async (
  code,
  chain,
  magic,
  account,
  guard
) => {
  const pactClient = createClient(
    `${api}/chainweb/0.0/${network}/chain/${chain}/pact`
  );
  console.log("guard", guard);
  const tx = Pact.builder
    .execution(code)
    .addSigner({
      pubKey: guard.keys[0],
      scheme: "WebAuthn",
    })
    .setMeta({
      chainId: String(chain),
      gasLimit: 10000,
      gasPrice: 0.0000001,
      sender: account,
    })
    .setNetworkId(network)
    .addKeyset("ks", guard.pred, ...guard.keys)
    .createTransaction();
  console.log("tx send", tx);
  try {
    const { transactions } = await magic.kadena.signTransactionWithSpireKey(tx);
    console.log("transactions", transactions);

    const signedTx = transactions[0];
    const preflightResult = await pactClient.preflight(signedTx);
    if (preflightResult.result.status === "failure") {
      return { preflightResult };
    }

    const transactionDescriptor = await pactClient.submit(signedTx);

    return { pactClient, transactionDescriptor, preflightResult };
  } catch (error) {
    throw error;
  }
};
