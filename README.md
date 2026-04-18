<div align="center">

<br/>

```
██████╗ ██╗   ██╗██████╗ ███████╗███████╗ ██████╗██████╗  ██████╗ ██╗    ██╗
██╔══██╗██║   ██║██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██╔═══██╗██║    ██║
██████╔╝██║   ██║██████╔╝█████╗  ███████╗██║     ██████╔╝██║   ██║██║ █╗ ██║
██╔═══╝ ██║   ██║██╔══██╗██╔══╝  ╚════██║██║     ██╔══██╗██║   ██║██║███╗██║
██║     ╚██████╔╝██║  ██║███████╗███████║╚██████╗██║  ██║╚██████╔╝╚███╔███╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ 
```

### Reputation-Based Web3 Escrow on Stellar Soroban

<br/>

[![Build Status](https://img.shields.io/badge/build-passing-22c55e?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-7c3aed?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Rust](https://img.shields.io/badge/Rust-Soroban-CE422B?style=for-the-badge&logo=rust&logoColor=white)](https://soroban.stellar.org)
[![License](https://img.shields.io/badge/license-MIT-FF6B35?style=for-the-badge)](LICENSE)

<br/>

> **Trustless transactions. Persistent reputation. On-chain accountability.**  
> PurEscrow prevents fraud by penalizing bad actors and rewarding consistent delivery — autonomously, on every transaction.

<br/>

</div>

---

## 🖼️ App Glimpses

<table>
  <tr>
    <td width="50%">
      <img src="/glimpse1.png" alt="PurEscrow Dashboard" width="100%" style="border-radius:8px"/>
      <p align="center"><sub>Personal Dashboard — Active Escrows & Reputation Score</sub></p>
    </td>
    <td width="50%">
      <img src="/glimpse2.png" alt="PurEscrow Escrow Detail" width="100%" style="border-radius:8px"/>
      <p align="center"><sub>Escrow Detail — IPFS Evidence Panel & Arbitration Flow</sub></p>
    </td>
  </tr>
</table>

---

## 📱 Fully Responsive

<div align="center">
  <img src="/mobile-responsive.png" alt="Mobile Responsive Design" width="85%"/>
  <br/>
  <sub>Glassmorphism UI · Bottom Navigation on Mobile · Fluid Typography</sub>
</div>

---

## ⚙️ CI/CD Pipeline

<div align="center">
  <img src="/ci-cd.png" alt="CI/CD Pipeline — All Checks Passing" width="90%"/>
  <br/>
  <sub>GitHub Actions · Soroban Contract Build → Testnet Deploy → Integration Smoke Test</sub>
</div>

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🔐 **Decentralized Escrow** | Fund, confirm, and dispute transactions fully on-chain via Soroban smart contracts |
| 🏆 **On-Chain Reputation** | Scores (0–1000) updated autonomously after every delivery or dispute resolution |
| 🏛️ **Qualified Arbitration** | Users with Reputation ≥ 150 unlock Arbitrator status for dispute resolution |
| 📁 **IPFS Evidence** | Large files and dispute evidence stored on IPFS (Pinata); CIDs recorded on-chain |
| 🎖️ **NFT Achievements** | Milestone badges minted by the Reputation contract upon verified delivery streaks |
| 📊 **Global Marketplace** | Public feed of all on-chain escrows with live status and party reputation |
| 🌑 **Premium Dark UI** | Deep black (`#0B0B0B`), Red/Orange accents, glassmorphism borders throughout |
| 📱 **Mobile-First** | Bottom navigation, fluid typography, and 2% horizontal margin on small screens |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 15)                │
│   Dashboard · Global Escrows · Escrow Detail · Profile      │
└──────────────────────────┬──────────────────────────────────┘
                           │  stellar-sdk + Freighter Wallet
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Stellar Soroban RPC (Testnet)             │
│                                                             │
│   ┌──────────────────────┐    cross-contract call           │
│   │    Escrow Contract   │ ──────────────────────────────►  │
│   │                      │                                  │
│   │  create_escrow()     │   ┌──────────────────────────┐  │
│   │  fund_escrow()       │   │  Reputation Contract     │  │
│   │  confirm_delivery()  │   │                          │  │
│   │  raise_dispute()     │   │  record_deal()           │  │
│   │  resolve_dispute()   │   │  award_achievement()     │  │
│   └──────────────────────┘   │  get_score()             │  │
│                               └──────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │  IPFS CID stored on-chain
                           ▼
                   ┌───────────────┐
                   │  IPFS / Pinata │
                   │  Evidence files│
                   └───────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TailwindCSS 4, Framer Motion |
| **Smart Contracts** | Rust · Soroban SDK · Dual-contract architecture |
| **Blockchain** | Stellar Testnet (Soroban RPC) |
| **Wallet** | `@stellar/stellar-wallets-kit` · Freighter |
| **Storage** | IPFS via Pinata (evidence files + CID on-chain) |
| **CI/CD** | GitHub Actions |

---

## 📂 Project Structure

```
PurEscrow/
├── contracts/
│   ├── escrow/
│   │   └── src/lib.rs          # Lifecycle: Create → Fund → Confirm → Dispute → Resolve
│   └── reputation/
│       └── src/lib.rs          # Score management, tier thresholds, NFT achievements
│
├── app/
│   ├── page.js                 # Personal Dashboard (active + recent escrows)
│   ├── global-escrows/
│   │   └── page.js             # Public marketplace of all on-chain transactions
│   ├── profile/
│   │   └── page.js             # Reputation analytics + Achievement showcase
│   └── escrow/[id]/
│       └── page.js             # Single escrow interaction panel
│
├── components/
│   ├── Navbar.js               # Desktop sidebar navigation
│   ├── BottomNav.js            # Mobile bottom navigation
│   └── ui/
│       ├── EscrowCard.js       # Primary data visualization component
│       └── WalletConnection.js # Stellar wallet state manager
│
├── lib/
│   └── stellar.js              # Soroban RPC bridge (all on-chain reads/writes)
│
├── public/
│   ├── glimpse1.png
│   ├── glimpse2.png
│   ├── mobile-responsive.png
│   └── ci-cd.png
│
└── .github/
    └── workflows/              # CI/CD: build, test, testnet deploy
```

---

## 🚀 Setup

### Prerequisites

- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) installed
- Rust with `wasm32v1-none` target (compatible with Rust 1.84+)
- Node.js 18+

### 1. Smart Contracts

```bash
cd contracts

# Build both contracts for Soroban
cargo build --target wasm32v1-none --release
```

### 2. Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### 3. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CDK2GV7L5LBUEVJ3COZ2BIJBL6B2POQQZYND62MONEK4G3VMTIJXWNAK
NEXT_PUBLIC_REPUTATION_CONTRACT_ID=CC5I3XKXAOBVZOSP3Y64N2ZP5LLKSNSX5FK2P4UU47BYKCO2O47INAQN
```

---

## ⚖️ Arbitration Flow

```
1. DISPUTE RAISED
   Either party calls raise_dispute(escrow_id)
   → Funds locked in contract, dispute timer begins

2. EVIDENCE PHASE
   Both parties upload files to IPFS via Pinata
   → CIDs submitted on-chain via submit_evidence(escrow_id, cid)

3. ARBITRATOR REVIEW
   Qualified users (Reputation ≥ 150) inspect the full timeline
   → Arbitrator calls resolve_dispute(id, winner, arbitrator)

4. AUTONOMOUS REPUTATION UPDATE
   Escrow contract cross-calls Reputation contract
   → Winner gains score · Loser penalized · Arbitrator rewarded
```

---

## ✅ Verified On-Chain Proof

The cross-contract reputation update — `Escrow::confirm_delivery` autonomously calling `Reputation::record_deal` — has been **verified live on Stellar Testnet**.

| Field | Value |
|---|---|
| **Transaction Hash** | `58a498db40cc18b3d382be7b88176b7e3b8db51da57290c4b37891e97d73f65e` |
| **Flow** | `Escrow::confirm_delivery` → `Reputation::record_deal` |
| **Effect** | Recipient reputation updated + achievement awarded autonomously |
| **Explorer** | [View on Stellar Expert ↗](https://stellar.expert/explorer/testnet/tx/58a498db40cc18b3d382be7b88176b7e3b8db51da57290c4b37891e97d73f65e) |

---

## 🎖️ Reputation System

```
  0 ──────── 50 ──────── 150 ──────── 500 ──────── 1000
  │           │            │             │             │
 New       Trusted     Arbitrator    Veteran       Legend
 User      Partner     Eligible      Dealer        Status
```

- **Successful delivery** → `+score` for both parties
- **Dispute loss** → `−score` for the losing party  
- **Arbitration** → small reward for correct resolution
- **Milestones** → NFT-style Achievements minted by the Reputation contract

---

## 📜 License

MIT © 2025 PurEscrow

---

<div align="center">

**Built on Stellar. Secured by Soroban. Governed by Reputation.**

<br/>

[![Stellar Expert](https://img.shields.io/badge/View%20on-Stellar%20Expert-7c3aed?style=for-the-badge)](https://stellar.expert/explorer/testnet/tx/58a498db40cc18b3d382be7b88176b7e3b8db51da57290c4b37891e97d73f65e)

</div>