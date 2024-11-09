import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { lisk, liskSepolia } from 'wagmi/chains'
import { X } from 'lucide-react'

export function WalletConnectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, chainId, status: accountStatus } = useAccount()
  const { connect, connectors, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain()

  const toggleModal = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Connect Button */}
      <button
        onClick={toggleModal}
        className="fixed top-4 left-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
      >
        {accountStatus === 'connected' ? 
          `${address?.slice(0, 6)}...${address?.slice(-4)}` : 
          'Connect Wallet'
        }
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full relative">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Connect Wallet
            </h2>

            {accountStatus === 'connected' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Status: {accountStatus}</p>
                <p className="text-sm text-gray-600 break-all">
                  Address: {address}
                </p>
                <p className="text-sm text-gray-600">
                  Chain ID: {chainId}
                </p>
                
                {/* Chain Switching Section */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Switch Network:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => switchChain({ chainId: lisk.id })}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                        chainId === lisk.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      Lisk
                    </button>
                    <button
                      onClick={() => switchChain({ chainId: liskSepolia.id })}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                        chainId === liskSepolia.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      Lisk Sepolia
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    disconnect()
                    toggleModal()
                  }}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                  Disconnect
                </button>
              </div>
            )}

            {accountStatus !== 'connected' && (
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      connect({ connector })
                      if (status === 'success') toggleModal()
                    }}
                   
                    className="w-full bg-purple-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {connector.name}
                    
                  </button>
                ))}
              </div>
            )}

            {status === 'pending' && (
              <p className="mt-4 text-blue-600">Connecting...</p>
            )}
            {error && (
              <p className="mt-4 text-red-500 text-sm">{error.message}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}