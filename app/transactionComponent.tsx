"use client";
import { useState } from "react";
import { parseEther } from "viem";
import { ConnectWalletClient } from "./client";

export default function TransactionComponent() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setValue = (setter: any) => (evt: any) => setter(evt.target.value);

  async function handleClick() {
    if (!amount || !recipient) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const walletClient = ConnectWalletClient();
      const [address] = await walletClient.getAddresses();
      
      const hash = await walletClient.sendTransaction({
        account: address,
        to: recipient as `0x${string}`,
        value: parseEther(amount), // Convert to Wei
      });
      
      alert(`Transaction successful. Transaction Hash: ${hash}`);
      setAmount("");
      setRecipient("");
    } catch (error) {
      alert(`Transaction failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Send Transaction</h2>
      
      <label className="block mb-2">
        Amount (ETH):
        <input
          placeholder="0.01"
          value={amount}
          onChange={setValue(setAmount)}
          className="block mt-1"
        ></input>
      </label>
      
      <br />
      
      <label className="block mb-2">
        Recipient:
        <input
          placeholder="0x..."
          value={recipient}
          onChange={setValue(setRecipient)}
          className="block mt-1"
        ></input>
      </label>
      
      <button
        className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-green-500 text-white disabled:bg-gray-400"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Transaction"}
      </button>
    </div>
  );
}
