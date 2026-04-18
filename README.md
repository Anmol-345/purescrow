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
# Build contracts
cargo build --target wasm32-unknown-unknown --release
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
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CDYYU2CNZBXEBOZTOG7LOYRPQ4MEATETKJVKTOBQ5PPBA6X4MEB35GP6
NEXT_PUBLIC_REPUTATION_CONTRACT_ID=CAFPMRKE6RX5GUGI5H2UZOKJH3ZXWPKN3NKE26RCQ3DMBDIPKW5LNXCA
```

---

## ⚖️ Arbitration Flow

1. **Dispute Raised**: Either party locks the funds.
2. **Evidence Phase**: Parties submit CIDs of images/logs via the IPFS panel.
3. **Resolution**: Qualified Arbitrators (Reputation >= 150) review the timeline and call `resolve_dispute(id, winner, arbitrator)`.
4. **Reputation Update**: The smart contract automatically updates the global score of both parties based on the outcome.
