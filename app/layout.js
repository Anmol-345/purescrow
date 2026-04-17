import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PurEscrow | Reputation-Based Web3 Escrow",
  description: "Secure, decentralized escrow with on-chain reputation and IPFS evidence storage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="flex min-h-screen">
            {/* Navigational Sidebar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 ml-20 md:ml-64 p-4 md:p-12 min-h-screen bg-[#0B0B0B]">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
