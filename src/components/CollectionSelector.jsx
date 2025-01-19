import { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { createCollection } from '../utils/collection';

const CollectionSelector = ({ onSelect }) => {
  const { walletData } = useWallet();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionSize, setNewCollectionSize] = useState('0');
  
  useEffect(() => {
    const storedCollections = localStorage.getItem('collections');
    if (storedCollections) {
      setCollections(JSON.parse(storedCollections));
    }
  }, []);

  const handleCreateCollection = async () => {
    console.log("walletData", walletData);
    if (!walletData.isConnected) return;
  
    try {
      const result = await createCollection(
        newCollectionName,
        parseInt(newCollectionSize),
        walletData.account,
        walletData.publicKey
      );
  
      if (result.preflightResult?.result?.status === 'success') {
        const newCollection = {
          id: result.preflightResult.result.data,
          name: newCollectionName,
          size: parseInt(newCollectionSize),
          creator: walletData.account,
          txId: result.transactionDescriptor.requestKey
        };
  
        const updatedCollections = [...collections, newCollection];
        setCollections(updatedCollections);
        localStorage.setItem('collections', JSON.stringify(updatedCollections));
        
        setShowNewForm(false);
        setNewCollectionName('');
        setNewCollectionSize('0');
      }
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Collection
          </label>
          <div className="relative">
          <select
              value={selectedCollection}
              onChange={(e) => {
                setSelectedCollection(e.target.value);
                onSelect(e.target.value);
              }}
              className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              disabled={!walletData.isConnected}
            >
              <option value="">Choose a collection...</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name} {collection.size > 0 ? `(${collection.size})` : '(Unlimited)'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1 px-3 py-2 text-sm text-emerald-600 hover:text-emerald-700"
          disabled={!walletData.isConnected}
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>

      {showNewForm && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name
            </label>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size (0 for unlimited)
            </label>
            <input
              type="number"
              min="0"
              value={newCollectionSize}
              onChange={(e) => setNewCollectionSize(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreateCollection}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Create Collection
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionSelector;