import React from 'react';
import { Grid, ShoppingBag, Home, Car, Briefcase, Smartphone, PawPrint, Wrench } from 'lucide-react';
import { CategoryID } from '../types';

interface CategoryPillProps {
  key?: string;
  id: CategoryID;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryPill({ id, label, isActive, onClick }: CategoryPillProps) {
  const getIcon = () => {
    const iconClass = `w-4 h-4 transition-colors duration-200 ${isActive ? 'text-black' : 'text-zinc-400'}`;
    switch (id) {
      case 'all':
        return <Grid className={iconClass} />;
      case 'market':
        return <ShoppingBag className={iconClass} />;
      case 'realestate':
        return <Home className={iconClass} />;
      case 'cars':
        return <Car className={iconClass} />;
      case 'jobs':
        return <Briefcase className={iconClass} />;
      case 'phones':
        return <Smartphone className={iconClass} />;
      case 'livestock':
        return <PawPrint className={iconClass} />;
      case 'services':
        return <Wrench className={iconClass} />;
      default:
        return <Grid className={iconClass} />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
        isActive
          ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20'
          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      {getIcon()}
      <span>{label}</span>
    </button>
  );
}
