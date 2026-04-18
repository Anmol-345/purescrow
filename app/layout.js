import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Navbar } from "@/components/Navbar";
import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PurEscrow | Reputation-Based Web3 Escrow",
  description: "Secure, decentralized escrow with on-chain reputation and IPFS evidence storage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <WalletProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Desktop Navigational Sidebar */}
            <Navbar />

            {/* Mobile Header */}
            <MobileHeader />

            {/* Main Content Area */}
            <main className="flex-1 transition-all duration-500 pt-20 md:pt-12 md:ml-64 pb-24 md:pb-12 px-2 md:px-12 min-h-screen bg-[#0B0B0B]">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
