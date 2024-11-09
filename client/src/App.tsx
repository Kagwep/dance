import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { WalletConnectModal } from './componets/WalletConnectModal'
import { useReadContract, useAccount } from 'wagmi'
import { StatsDisplay } from './componets/StatsDisplay'
import { DanceScene } from './componets/DanceScene'
import { BuyCreditsButton } from './componets/BuyCreditsButton'

function App() {

  

  return (

    <div className="h-screen w-full relative">
      <DanceScene />
      <WalletConnectModal />
      <StatsDisplay />
      <BuyCreditsButton />
    </div>

  )
}

export default App