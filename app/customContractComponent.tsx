"use client";
import { getContract } from "viem";
import { ConnectPublicClient } from "./client";
import { useState } from "react";

// ABI для любого ERC20 токена
const erc20Abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
] as const;

export default function CustomContractComponent() {
  const [contractAddress, setContractAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setValue = (setter: any) => (evt: any) => setter(evt.target.value);

  async function getTokenInfo() {
    if (!contractAddress) {
      alert("Please enter contract address");
      return;
    }

    setIsLoading(true);
    try {
      const publicClient = ConnectPublicClient();
      
      const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi: erc20Abi,
        client: publicClient,
      });

      const name = await contract.read.name();
      const symbol = await contract.read.symbol();
      const decimals = await contract.read.decimals();
      const totalSupply = await contract.read.totalSupply();

      let balance = "N/A";
      if (userAddress) {
        try {
          const balanceRaw = await contract.read.balanceOf([userAddress as `0x${string}`]);
          balance = (Number(balanceRaw) / Math.pow(10, Number(decimals))).toString();
        } catch (error) {
          console.error("Error getting balance:", error);
        }
      }

      setResult(`Token Info:
Name: ${name}
Symbol: ${symbol}
Decimals: ${decimals}
Total Supply: ${totalSupply.toString()}
${userAddress ? `Balance: ${balance} ${symbol}` : ''}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Custom ERC20 Token</h2>
      
      <label className="block mb-2">
        Contract Address:
        <input
          placeholder="0x..."
          value={contractAddress}
          onChange={setValue(setContractAddress)}
          className="block mt-1"
        />
      </label>
      
      <br />
      
      <label className="block mb-2">
        User Address (optional):
        <input
          placeholder="0x..."
          value={userAddress}
          onChange={setValue(setUserAddress)}
          className="block mt-1"
        />
      </label>
      
      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-orange-500 text-white disabled:bg-gray-400 mb-4"
        onClick={getTokenInfo}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Token Info"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
