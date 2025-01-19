import React, { useState } from 'react';
import CollectionSelector from './CollectionSelector';
import MintingInterface from './MintingInterface';

const MintingContainer = ({ walletData }) => {
    const [selectedCollectionId, setSelectedCollectionId] = useState('');
  
    const handleCollectionSelect = (collectionId) => {
      setSelectedCollectionId(collectionId);
    };
  
    return (
      <>
        <CollectionSelector onSelect={handleCollectionSelect} />
        <div className="mt-8">
          <MintingInterface 
            account={walletData.account}
            guard={{
              keys: [walletData.publicKey],
              pred: 'keys-all'
            }}
            selectedCollectionId={selectedCollectionId}
          />
        </div>
      </>
    );
  };

export default MintingContainer;