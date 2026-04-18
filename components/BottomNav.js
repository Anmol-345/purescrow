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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 z-[60] flex items-center justify-around px-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                    <Link 
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                            isActive ? 'text-accent-red scale-110' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <div className={`p-1 ${isActive ? 'bg-accent-red/10 rounded-lg' : ''}`}>
                            <Icon size={20} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-white' : ''}`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-accent-red shadow-[0_0_8px_rgba(255,59,59,0.8)]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
