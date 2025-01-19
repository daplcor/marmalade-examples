import { useState, useEffect } from "react";
import { Image } from "lucide-react";
import { mint } from "../utils/kadena";
import { useWallet } from "../context/WalletContext";

const MintingInterface = ({ account, guard, selectedCollectionId }) => {
  const { walletData } = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [tokenUri, setTokenUri] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [royaltyRecipient, setRoyaltyRecipient] = useState(account || "");
  const [mintTo, setMintTo] = useState(account || "");

  useEffect(() => {
    if (account) {
      setMintTo(account);
    }
  }, [account]);

  useEffect(() => {
    setCollectionId(selectedCollectionId);
  }, [selectedCollectionId]);

  const handleMint = async () => {
    if (!collectionId || !tokenUri || !name) {
      alert("Collection ID, URI and name are required");
      return;
    }

    try {
      const envData = {
        uri: tokenUri,
        name,
        description,
        collection_id: collectionId,
      };

      const result = await mint(
        envData,
        account,
        walletData.publicKey,
        mintTo,
        royalties,
        royalties > 0 ? royaltyRecipient : null
      );

      if (result.preflightResult?.result?.status === "failure") {
        alert(`Minting failed: ${result.preflightResult.result.error.message}`);
      }
    } catch (error) {
      console.error("Minting failed:", error);
      alert(`Minting failed: ${error.message}`);
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mint NFT</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="collectionId"
              className="block text-sm font-medium text-gray-700"
            >
              Collection ID
            </label>
            <input
              type="text"
              id="collectionId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-100"
              value={collectionId}
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="mintTo"
              className="block text-sm font-medium text-gray-700"
            >
              Mint To Address
            </label>
            <input
              type="text"
              id="mintTo"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
            />
            {account && (
              <p className="text-sm text-gray-600 mt-1">
                (defaulted to connected wallet)
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tokenUri"
              className="block text-sm font-medium text-gray-700"
            >
              Token URI
            </label>
            <input
              type="text"
              id="tokenUri"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={tokenUri}
              onChange={(e) => setTokenUri(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              NFT Image (Preview Only)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="royalties"
              className="block text-sm font-medium text-gray-700"
            >
              Enable Royalties
            </label>
            <input
              type="checkbox"
              id="enableRoyalties"
              className="mt-1 mr-2"
              checked={royalties > 0}
              onChange={(e) => setRoyalties(e.target.checked ? 2.5 : 0)}
            />
          </div>

          {royalties > 0 && (
            <>
              <div>
                <label
                  htmlFor="royaltyRecipient"
                  className="block text-sm font-medium text-gray-700"
                >
                  Royalty Recipient
                </label>
                <input
                  type="text"
                  id="royaltyRecipient"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={royaltyRecipient}
                  onChange={(e) => setRoyaltyRecipient(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="royalties"
                  className="block text-sm font-medium text-gray-700"
                >
                  Royalties: {royalties}%
                </label>
                <input
                  type="range"
                  id="royalties"
                  min="0"
                  max="10"
                  step="0.1"
                  className="mt-1 block w-full"
                  value={royalties}
                  onChange={(e) => setRoyalties(parseFloat(e.target.value))}
                />
              </div>
            </>
          )}

          <button
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={handleMint}
          >
            Mint NFT
          </button>
        </div>
      </div>

      <div className="mt-8 lg:mt-0">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="NFT Preview"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400">No image selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintingInterface;
