import React, { useState } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { ABI, CONTRACT_ADDRESS } from '../constants';

const LeaderboardDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: leaderboardData, isError, isLoading, refetch: refetchLeaderboard } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getLeaderboard',
    args: [10],
    query: {
      refetchInterval: 5000,
    }
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'DancePerformed',
    onLogs: () => {
      refetchLeaderboard();
    },
  });

  const topUsers = leaderboardData?.[0] || [];
  const userPoints = leaderboardData?.[1] || [];

  const getMedalColor = (index) => {
    switch(index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-60 right-0 h-full">
      {/* Container that wraps both button and panel */}
      <div 
        className={`
          flex absolute right-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-2.5rem)]'}
        `}
      >
        {/* Button Tab - Now positioned at the top */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              absolute top -left-10
              flex items-center gap-2 px-3 py-4 bg-purple-600 text-white
              rounded-l-lg z-10 hover:bg-purple-700 transition-colors
              transform rotate-180 whitespace-nowrap
            `}
            style={{ writingMode: 'vertical-rl' }}
          >
            <Trophy size={20} className="transform rotate-180" />
            <span className="font-semibold">Leaderboard</span>
          </button>
        </div>

        {/* Leaderboard Panel */}
        <div className="w-64 bg-white h-full shadow-xl border-l border-gray-200">
          {/* Header */}
          <div className="p-4 bg-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Trophy size={24} />
              <h2 className="text-lg font-bold">Top Dancers</h2>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading leaderboard...
              </div>
            ) : isError ? (
              <div className="p-4 text-center text-red-500">
                Error loading leaderboard
              </div>
            ) : topUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No players yet
              </div>
            ) : (
              <div className="divide-y">
                {topUsers.map((address, index) => (
                  <div
                    key={address}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${getMedalColor(index)}`}>
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {`${address.slice(0, 6)}...${address.slice(-4)}`}
                      </span>
                    </div>
                    <span className="font-bold text-purple-600">
                      {userPoints[index].toString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardDisplay;