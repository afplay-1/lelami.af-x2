import React from 'react';
import { Check } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md';
  label?: string;
}

export default function VerifiedBadge({ size = 'sm', label }: VerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wider uppercase' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Check className={size === 'sm' ? 'w-3 h-3 stroke-[3]' : 'w-3.5 h-3.5 stroke-[3]'} />
      {label || 'Verified'}
    </span>
  );
}
