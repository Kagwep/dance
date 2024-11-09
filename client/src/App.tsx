import { WalletConnectModal } from './componets/WalletConnectModal'
import { useAccount } from 'wagmi'
import { StatsDisplay } from './componets/StatsDisplay'
import { DanceScene } from './componets/DanceScene'
import { BuyCreditsButton } from './componets/BuyCreditsButton'

function App() {
  const { address, isConnected } = useAccount()
  
  return (
    <div className="h-screen w-full relative">
      <DanceScene />
      <WalletConnectModal />
      
      {isConnected ? (
        <>
        <BuyCreditsButton />
          <StatsDisplay />
          
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 p-8 rounded-lg text-center backdrop-blur-md border border-white/20">
            <WalletConnectModal />
            <h2 className="text-2xl font-bold text-white mb-4 mt-8">Connect Your Wallet</h2>
            <p className="text-white/80 mb-4">
              Please connect your wallet to view stats and buy credits
            </p>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default App