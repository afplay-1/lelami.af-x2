import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl select-none">
      <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-450 mb-4 animate-pulse">
        {icon || <ShoppingBag className="w-6 h-6 text-zinc-500" />}
      </div>
      <h3 className="text-zinc-200 font-extrabold text-sm tracking-tight">{title}</h3>
      {subtitle && <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed max-w-[280px]">{subtitle}</p>}
    </div>
  );
}
