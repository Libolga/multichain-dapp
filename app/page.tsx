import TokenComponent from "./tokenComponent";
import TransactionComponent from "./transactionComponent";
import WalletComponent from "./walletComponent";
import CustomContractComponent from "./customContractComponent";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Multichain dApp</h1>
        <div className="flex flex-col items-center justify-center gap-6">
          <WalletComponent />
          <TransactionComponent />
          <TokenComponent />
          <CustomContractComponent />
        </div>
      </div>
    </main>
  );
}
