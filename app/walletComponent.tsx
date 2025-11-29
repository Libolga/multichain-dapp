"use client";
import { useState, useEffect } from "react";
import { ConnectWalletClient, ConnectPublicClient, switchNetwork } from "./client";

export default function WalletComponent() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(BigInt(0));
  const [chainId, setChainId] = useState(11155111); // Sepolia by default

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const walletClient = ConnectWalletClient(chainId);
          const publicClient = ConnectPublicClient(chainId);
          const [address] = await walletClient.getAddresses();
          const balance: bigint = await publicClient.getBalance({ address });
          setAddress(address);
          setBalance(balance);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  }

  async function handleConnect() {
    try {
      const walletClient = ConnectWalletClient(chainId);
      const publicClient = ConnectPublicClient(chainId);
      
      if (typeof window !== "undefined" && window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      
      const [address] = await walletClient.getAddresses();
      const balance: bigint = await publicClient.getBalance({ address });
      setAddress(address);
      setBalance(balance);
    } catch (error) {
      alert(`Connection failed: ${error}`);
    }
  }

  async function handleNetworkChange(newChainId: number) {
    try {
      await switchNetwork(newChainId);
      setChainId(newChainId);
      
      // Refresh balance for new network
      if (address) {
        const publicClient = ConnectPublicClient(newChainId);
        const balance: bigint = await publicClient.getBalance({ address });
        setBalance(balance);
      }
    } catch (error) {
      alert(`Network switch failed: ${error}`);
    }
  }

  return (
    <div className="card">
      <Status address={address} balance={balance} chainId={chainId} />
      
      <div className="mb-4">
        <label className="block mb-2">Network:</label>
        <select 
          value={chainId} 
          onChange={(e) => handleNetworkChange(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value={11155111}>Sepolia</option>
          <option value={80002}>Polygon Amoy</option>
          <option value={84532}>Base Sepolia</option>
        </select>
      </div>

      <button 
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-blue-500 text-white"
        onClick={handleConnect}
      >
        <h1 className="mx-auto">{address ? "Refresh Balance" : "Connect Wallet"}</h1>
      </button>
    </div>
  );
}

function Status({
  address,
  balance,
  chainId,
}: {
  address: string;
  balance: BigInt;
  chainId: number;
}) {
  if (!address) {
    return (
      <div className="flex items-center mb-4">
        <div className="status-disconnected"></div>
        <div>Disconnected</div>
      </div>
    );
  }

  const networkName = getNetworkName(chainId);

  return (
    <div className="flex items-center w-full mb-4">
      <div className="status-connected"></div>
      <div className="text-sm">
        <div><b>Network:</b> {networkName}</div>
        <div><b>Address:</b> {address.slice(0, 6)}...{address.slice(-4)}</div>
        <div><b>Balance:</b> {balance.toString()} Wei</div>
      </div>
    </div>
  );
}

function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 11155111: return "Sepolia";
    case 80002: return "Polygon Amoy";
    case 84532: return "Base Sepolia";
    default: return "Unknown";
  }
}
