import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function StatusBadge({ status }) {
    const statusConfig = {
        CREATED: { label: 'Created', className: 'bg-zinc-800 text-zinc-400' },
        FUNDED: { label: 'Funded', className: 'bg-green-500/10 text-green-400 border border-green-500/20' },
        DELIVERED: { label: 'Delivered', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
        DISPUTED: { label: 'Disputed', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
        RESOLVED: { label: 'Resolved', className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
    };

    const config = statusConfig[status] || statusConfig.CREATED;

    return (
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider", config.className)}>
            {config.label}
        </span>
    );
}
