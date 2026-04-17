import { Inter } from "next/font/google";
import "./globals.css";
import { Shield, LayoutDashboard, PlusCircle, UserCircle, Settings } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PurEscrow | Reputation-Based Web3 Escrow",
  description: "Secure, decentralized escrow with on-chain reputation and IPFS evidence storage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* Main Sidebar */}
          <aside className="w-20 md:w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col items-center md:items-start py-8 px-4 gap-8 fixed h-full z-50">
            <Link href="/" className="flex items-center gap-3 px-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center shadow-lg shadow-accent-red/20">
                <Shield className="text-white" size={24} />
              </div>
              <span className="hidden md:block text-xl font-black tracking-tighter text-white">
                PUR<span className="text-accent-red">ESCROW</span>
              </span>
            </Link>

            <nav className="flex-1 w-full space-y-2">
              <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
              <SidebarLink href="/create" icon={<PlusCircle size={20} />} label="Create" />
              <SidebarLink href="/profile" icon={<UserCircle size={20} />} label="Profile" />
              <SidebarLink href="/settings" icon={<Settings size={20} />} label="Settings" />
            </nav>

            <div className="w-full mt-auto">
              <div className="hidden md:block p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-zinc-300">Stellar Testnet</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 ml-20 md:ml-64 p-4 md:p-12 min-h-screen bg-[#0B0B0B]">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

function SidebarLink({ href, icon, label, active = false }) {
  return (
    <Link 
      href={href}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
        ${active ? 'bg-zinc-900 border border-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
      `}
    >
      <div className={`${active ? 'text-accent-red' : 'group-hover:text-accent-red'} transition-colors`}>
        {icon}
      </div>
      <span className="hidden md:block font-semibold text-sm">
        {label}
      </span>
    </Link>
  );
}
