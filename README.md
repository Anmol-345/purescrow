# PurEscrow - Reputation-Based Web3 Escrow

A production-ready Web3 escrow application built on Stellar Soroban with an on-chain reputation system and IPFS-backed dispute resolution.

## 🚀 Features

- **Decentralized Escrow**: Fund, confirm, and dispute transactions on-chain.
- **Cryptographic Reputation**: Users earn score based on successful deliveries and lose points on dispute losses.
- **IPFS Evidence**: Large files and detailed evidence stored on IPFS with CIDs recorded on-chain.
- **Modern UI**: High-fidelity dark mode with deep black (#0B0B0B) and vibrant red/orange accents.
- **Responsive**: Fully optimized for mobile and desktop dashboards.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind 4, Framer Motion.
- **Smart Contracts**: Soroban (Rust SDK).
- **Storage**: IPFS (Pinata).
- **Blockchain**: Stellar Testnet.

---

## 📂 Project Structure

```text
├── contracts/
│   ├── reputation/       # User score management contract
│   └── escrow/           # Core transaction logic & reputation hooks
├── app/                  # Next.js App Router (Dashboard, Create, Detail, Profile)
├── components/           # Reusable UI components
├── lib/                  # Stellar & IPFS utilities
└── .github/workflows/    # CI/CD for build and test
```

---

## ⚙️ Setup Instructions

### 1. Smart Contracts
Ensure you have the [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) installed.

```bash
cd contracts
# Build contracts (using wasm32v1-none for compatibility with Rust 1.84+)
cargo build --target wasm32v1-none --release
```

### 2. Frontend
Install dependencies and run the development server.

```bash
# From root directory
npm install
npm run dev
```

### 3. Environment Variables
Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CDK2GV7L5LBUEVJ3COZ2BIJBL6B2POQQZYND62MONEK4G3VMTIJXWNAK
NEXT_PUBLIC_REPUTATION_CONTRACT_ID=CC5I3XKXAOBVZOSP3Y64N2ZP5LLKSNSX5FK2P4UU47BYKCO2O47INAQN
```

---

## ⚖️ Arbitration Flow

1. **Dispute Raised**: Either party locks the funds.
2. **Evidence Phase**: Parties submit CIDs of images/logs via the IPFS panel.
3. **Resolution**: Qualified Arbitrators (Reputation >= 150) review the timeline and call `resolve_dispute(id, winner, arbitrator)`.
4. **Reputation Update**: The smart contract automatically updates the global score of both parties based on the outcome.

---

## ✅ Proof of Work (Verified Flow)

The automated reputation update via cross-contract calls has been verified on the Stellar Testnet.

- **Transaction Hash**: `58a498db40cc18b3d382be7b88176b7e3b8db51da57290c4b37891e97d73f65e`
- **Flow**: `Escrow::confirm_delivery` ⮕ `Reputation::record_deal`
- **Verified On**: [Stellar Expert Explorer](https://stellar.expert/explorer/testnet/tx/58a498db40cc18b3d382be7b88176b7e3b8db51da57290c4b37891e97d73f65e)

This transaction demonstrates the `Escrow` contract successfully updating the recipient's reputation and awarding an achievement autonomously.
