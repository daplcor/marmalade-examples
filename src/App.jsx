import { Wallet } from 'lucide-react';
import { useWallet } from './context/WalletContext';
import MintingContainer from './components/MintingContainer';

const App = () => {
  const { walletData, connect } = useWallet();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Magic Marmalade Examples</span>
            </div>
            <button
              onClick={connect}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Wallet className="h-5 w-5" />
              {walletData.isConnected ? 
                `${walletData.account.slice(0, 6)}...${walletData.account.slice(-4)}` : 
                'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {walletData.isConnected ? (
          <MintingContainer walletData={walletData} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">Please connect your wallet to continue</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;