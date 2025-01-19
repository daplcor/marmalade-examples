import { Magic } from "magic-sdk";
import { KadenaExtension } from "@magic-ext/kadena";
import config from "../utils/config";

export const MAGIC = "MAGIC";

export const magic = new Magic(import.meta.env.VITE_MAGIC_API, {
  extensions: [
    new KadenaExtension({
      rpcUrl: `${config.apiUrl}/chainweb/0.0/${config.networkId}/chain/${config.chainId}/pact`,
      chainId: config.chainId,
      networkId: config.networkId,
      createAccountsOnChain: true,
    }),
  ],
});

const magicProvider = {
  name: "Magic",
  connect: async () => {
    try {
      const account = await magic.kadena.loginWithSpireKey();
      console.log('accoutn', account)
      return {
        status: "success",
        account: {
          account: account.accountName,
          publicKey: account.keyset,
          chainId: config.chainId,
        },
      };
    } catch (error) {
      console.error("Error connecting to Magic:", error);
      return { status: "failure", message: error.message };
    }
  },
  getInfo: async () => {
    try {
      const userInfo = await magic.kadena.getUserInfo();
      console.log('userInfo', userInfo)
      return userInfo;
    } catch (error) {
      console.error("Error getting Magic account info:", error);
      throw error;
    }
  }
};

export default magicProvider;