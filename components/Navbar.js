"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, LayoutDashboard, PlusCircle, UserCircle, Globe } from 'lucide-react';
import { WalletConnection } from "@/components/ui/WalletConnection";

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-950 flex-col items-start py-8 px-4 gap-8 fixed h-full z-50">
      <Link href="/" className="flex items-center gap-3 px-2 mb-8 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-red to-accent-orange flex items-center justify-center shadow-lg shadow-accent-red/20">
          <Shield className="text-white" size={24} />
        </div>
        <span className="hidden md:block text-xl font-black tracking-tighter text-white uppercase italic">
          PUR<span className="text-accent-red">ESCROW</span>
        </span>
      </Link>

      <nav className="flex-1 w-full space-y-2">
        <SidebarLink
          href="/"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={pathname === '/'}
        />
        <SidebarLink
          href="/global-escrows"
          icon={<Globe size={20} />}
          label="Marketplace"
          active={pathname === '/global-escrows'}
        />
        <SidebarLink
          href="/create"
          icon={<PlusCircle size={20} />}
          label="Create"
          active={pathname === '/create'}
        />
        <SidebarLink
          href="/profile"
          icon={<UserCircle size={20} />}
          label="Profile"
          active={pathname === '/profile'}
        />
      </nav>

      <div className="w-full mt-auto space-y-4">
        <div className="hidden md:block">
          <WalletConnection />
        </div>

        <div className="hidden md:block p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Status</span>
          <div className="flex items-center gap-2 text-zinc-300">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold">Stellar Testnet</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active = false }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
        ${active
          ? 'bg-zinc-900 border border-zinc-800 text-white shadow-xl shadow-black/20'
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'}
      `}
    >
      <div className={`
        transition-all duration-300 
        ${active ? 'text-accent-red scale-110 drop-shadow-[0_0_8px_rgba(255,59,59,0.3)]' : 'group-hover:text-accent-red group-hover:scale-110'}
      `}>
        {icon}
      </div>
      <span className={`
        hidden md:block font-bold text-sm tracking-tight
        ${active ? 'text-white' : 'text-inherit'}
      `}>
        {label}
      </span>

      {active && (
        <div className="hidden md:block ml-auto w-1 h-4 rounded-full bg-accent-red animate-pulse" />
      )}
    </Link>
  );
}
