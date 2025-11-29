"use client";
import { getContract } from "viem";
import { contractAbi } from "./abi";
import { ConnectWalletClient, ConnectPublicClient } from "./client";
import { useState } from "react";

export default function TokenComponent() {
  const [contractAddress, setContractAddress] = useState("0xae2a37b60b7af7fcca8167df617f82a34f22719c");
  const [tokenId, setTokenId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const setValue = (setter: any) => (evt: any) => setter(evt.target.value);

  async function buttonClick() {
    if (!contractAddress) {
      alert("Please enter contract address");
      return;
    }

    setIsLoading(true);
    try {
      const walletClient = ConnectWalletClient();
      const publicClient = ConnectPublicClient();
      
      const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        client: publicClient,
      });

      console.log("Connected to Contract: ", contract);

      const symbol = await contract.read.symbol();
      const name = await contract.read.name();

      console.log(`Symbol: ${symbol}\nName: ${name}\n`);
      
      let owner = "N/A";
      if (tokenId) {
        try {
          const token_id = BigInt(tokenId);
          owner = await contract.read.ownerOf([token_id]);
        } catch (error) {
          console.error("Error getting owner:", error);
          owner = "Token doesn't exist or error occurred";
        }
      }

      alert(`Symbol: ${symbol}\nName: ${name}\nOwner of token_id = ${tokenId}: ${owner}`);
    } catch (error) {
      alert(`Error interacting with contract: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">ERC721 Token Info</h2>
      
      <label className="block mb-2">
        Contract Address:
        <input
          placeholder="0x..."
          value={contractAddress}
          onChange={setValue(setContractAddress)}
          className="block mt-1"
        ></input>
      </label>
      
      <br />
      
      <label className="block mb-2">
        Token ID:
        <input 
          placeholder="1" 
          value={tokenId} 
          onChange={setValue(setTokenId)}
          className="block mt-1"
        />
      </label>
      
      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-purple-500 text-white disabled:bg-gray-400"
        onClick={buttonClick}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Token Info"}
      </button>
    </div>
  );
}
