"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Globe, PlusCircle, UserCircle } from 'lucide-react';

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', icon: LayoutDashboard, label: 'Home' },
        { href: '/global-escrows', icon: Globe, label: 'Market' },
        { href: '/create', icon: PlusCircle, label: 'Create' },
        { href: '/profile', icon: UserCircle, label: 'Profile' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-900 z-[60] flex items-center justify-around px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                    <Link 
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1.5 min-w-[64px] h-full transition-all duration-300 relative ${
                            isActive ? 'text-accent-red' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <div className={`
                            p-2 rounded-xl transition-all duration-300
                            ${isActive ? 'bg-accent-red/10 scale-110 shadow-[0_0_15px_rgba(255,59,59,0.1)]' : 'active:scale-90'}
                        `}>
                            <Icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,59,59,0.5)]' : ''} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider transition-all ${isActive ? 'text-white translate-y-[-2px]' : 'scale-90'}`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-red shadow-[0_0_10px_rgba(255,59,59,1)]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
