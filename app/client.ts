import { createWalletClient, createPublicClient, custom, http } from "viem";
import { sepolia, polygonAmoy, baseSepolia } from "viem/chains";
import "viem/window";

export function ConnectPublicClient(chainId: number = 11155111) {
  let transport;
  const chain = getChainById(chainId);
  
  if (typeof window !== "undefined" && window.ethereum) {
    transport = custom(window.ethereum);
  } else {
    transport = http();
  }

  const publicClient = createPublicClient({
    chain: chain,
    transport: transport,
  });

  return publicClient;
}

export function ConnectWalletClient(chainId: number = 11155111) {
  let transport;
  const chain = getChainById(chainId);
  
  if (typeof window !== "undefined" && window.ethereum) {
    transport = custom(window.ethereum);
  } else {
    const errorMessage = "Web3 wallet is not installed. Please install MetaMask or another Web3 wallet.";
    throw new Error(errorMessage);
  }

  const walletClient = createWalletClient({
    chain: chain,
    transport: transport,
  });

  return walletClient;
}

function getChainById(chainId: number) {
  switch (chainId) {
    case 11155111: // Sepolia
      return sepolia;
    case 80002: // Polygon Amoy
      return polygonAmoy;
    case 84532: // Base Sepolia
      return baseSepolia;
    default:
      return sepolia;
  }
}

export async function switchNetwork(chainId: number) {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Chain not added, let's add it
        const chain = getChainById(chainId);
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [chain.rpcUrls.default.http[0]],
            blockExplorerUrls: [chain.blockExplorers?.default?.url],
          }],
        });
      }
    }
  }
}
