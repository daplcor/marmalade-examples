import { createContext, useContext, useState } from 'react';
import magicProvider from '../wallet/magic';
import { createClient } from '@kadena/client';
import config from '../utils/config';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({
    account: '',
    publicKey: '',
    isConnected: false,
    client: null
  });

  const connect = async () => {
    try {
      const loginResult = await magicProvider.connect();
      if (loginResult.status === 'success') {
        const userInfo = await magicProvider.getInfo();
        const client = createClient(config.rpcUrl);
        
        setWalletData({
          account: loginResult.account.account,
          publicKey: loginResult.account.publicKey,
          isConnected: true,
          client
        });
        
        return { status: 'success' };
      }
      return loginResult;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return { status: 'failure', message: error.message };
    }
  };

  return (
    <WalletContext.Provider value={{ walletData, connect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);