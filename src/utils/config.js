const config = {
    testnet: {
      apiUrl: "https://api.testnet.chainweb.com",
      client: "https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact",
      contract: "n_f9b22d2046c2a52575cc94f961c8b9a095e349e7.wallet-reg",
      chainId: "1",
      networkId: "testnet04",
    },
    mainnet: {
      apiUrl: "https://api.chainweb.com",
      client: "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact",
      chainId: "8",
      networkId: "mainnet01",
    }
  };
  
  // Determine the current environment
  const currentEnv = import.meta.env.VITE_APP_ENV === 'mainnet' ? 'mainnet' : 'testnet';
    export default config[currentEnv];
