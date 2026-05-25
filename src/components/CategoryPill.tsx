import React from 'react';
import { CategoryID } from '../types';
import CategoryIcon from './CategoryIcon';

interface CategoryPillProps {
  key?: string;
  id: CategoryID;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryPill({ id, label, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
        isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
          : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200/50 hover:border-zinc-300'
      }`}
    >
      <CategoryIcon id={id} className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
      <span>{label}</span>
    </button>
  );
}

