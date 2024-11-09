# Dance Game dApp 🕺💃

A blockchain-based dancing game where players can earn points by performing dance moves using credits. Built with Babylon.js for 3D visualization and smart contracts on Lisk Sepolia testnet.

## Features

- **3D Dance Visualization**: Interactive 3D character performing dance animations
- **Blockchain Integration**: Smart contract interactions for dance moves and points
- **Real-time Stats**: Live updates of player credits and points
- **Wallet Connection**: Support for multiple wallet connections
- **Chain Management**: Built for Lisk Sepolia testnet

## Tech Stack

- **Frontend**:
  - React + Vite
  - Tailwind CSS for styling
  - Babylon.js for 3D rendering
  - wagmi v2 for blockchain interactions
  - viem for Ethereum interactions

- **Blockchain**:
  - Solidity smart contracts
  - Lisk Sepolia testnet
  - EVM compatible

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```env
VITE_DANCER=your_private_key_here
```

3. Run development server:
```bash
npm run dev
```

## Smart Contract Interaction

### Key Functions

- `buyCredits`: Purchase dance credits
- `dance`: Perform a dance move (consumes credits)
- `checkPoints`: View accumulated points
- `checkCredits`: Check remaining credits

### Game Mechanics

1. Purchase credits using the buy button
2. Click dance to perform moves
3. Each dance:
   - Consumes 1 credit
   - Awards 10 points
   - Plays 5-second animation

## Project Structure

```
src/
├── components/
│   ├── DanceScene.tsx    # 3D scene and dance logic
│   ├── StatsDisplay.tsx  # Points and credits display
│   └── WalletConnect.tsx # Wallet connection modal
├── constants/
│   └── index.ts          # Contract addresses and ABIs
├── wagmi.ts              # Wagmi configuration
└── App.tsx               # Main application
```

## Development Notes

- Character model uses Mixamo animations
- Stats update every 2 seconds and on relevant events
- Error handling for insufficient credits
- Responsive design for various screen sizes

## Future Improvements

- [ ] Add more dance animations
- [ ] Implement combo system
- [ ] Add sound effects
- [ ] Create leaderboard
- [ ] Add multiplayer features

## License

MIT