import { useWriteContract, useAccount } from 'wagmi'
import { parseEther, createWalletClient, http, Account } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { CONTRACT_ADDRESS,ABI } from '../constants'

export function BuyCreditsButton() {
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  

  const handleBuyCredits = async () => {
 

    const amount = 10n // Example: buying 10 credits
    const creditPrice = parseEther('0.0001') // 0.0001 ETH per credit
    const totalCost = creditPrice * amount

    writeContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'buyCredits',
      args: [address, amount],
      value: totalCost,
    })
  }

  return (
    <button
      onClick={handleBuyCredits}
      disabled={isPending}
      className="fixed bottom-4 left-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 
                 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
    >
      {isPending ? 'Buying...' : 'Buy Credits (10)'}
    </button>
  )
}