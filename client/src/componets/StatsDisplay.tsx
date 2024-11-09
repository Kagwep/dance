import { useReadContract, useAccount, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '../constants'
import { useEffect } from 'react'

export function StatsDisplay() {
    const { address, status } = useAccount()
  
    // Use refetchInterval for polling updates
    const { data: points, isError: pointsError, refetch: refetchPoints } = useReadContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'checkPoints',
      args: address ? [address] : undefined,
      query: {
        refetchInterval: 2000, // Refetch every 2 seconds
      }
    })
  
    const { data: credits, isError: creditsError, refetch: refetchCredits } = useReadContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'checkCredits',
      args: address ? [address] : undefined,
      query: {
        refetchInterval: 2000, // Refetch every 2 seconds
      }
    })

    // Watch for DancePerformed events
    useWatchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      eventName: 'DancePerformed',
      onLogs: (logs) => {
        // Check if the event is for current user
        console.log(logs)
        const relevantLog = logs.find(log => 
          log.args.creditOwner?.toLowerCase() === address?.toLowerCase()
          
        )
        if (relevantLog) {
          // Refetch stats when relevant event occurs
          refetchPoints()
          refetchCredits()
        }
      },
    })

    // Watch for CreditsAdded events
    useWatchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      eventName: 'CreditsAdded',
      onLogs: (logs) => {
        const relevantLog = logs.find(log => 
          log.args.user?.toLowerCase() === address?.toLowerCase()
        )
        if (relevantLog) {
          refetchCredits()
        }
      },
    })
  
    if (status !== 'connected') {
      return (
        <div className="fixed top-4 right-4 p-4 bg-gray-100 rounded-lg shadow-lg">
          <p className="text-gray-500">Connect wallet to view stats</p>
        </div>
      )
    }
  
    return (
      <div className="fixed top-4 right-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Points</h3>
            <div className="flex items-center">
              {pointsError ? (
                <span className="text-red-500">Error loading points</span>
              ) : (
                <span className="text-2xl font-bold text-purple-600">
                  {points?.toString() || '0'}
                </span>
              )}
            </div>
          </div>
  
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Credits</h3>
            <div className="flex items-center">
              {creditsError ? (
                <span className="text-red-500">Error loading credits</span>
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  {credits?.toString() || '0'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}