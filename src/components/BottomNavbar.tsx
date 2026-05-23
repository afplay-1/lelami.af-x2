import React from 'react';
import { Home, Search, Plus, MessageSquare, User } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessagesCount: number;
  labels: {
    home: string;
    search: string;
    sell: string;
    messages: string;
    profile: string;
  };
}

export default function BottomNavbar({
  activeTab,
  onTabChange,
  unreadMessagesCount,
  labels,
}: BottomNavbarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-6 pt-3 bg-black/30 backdrop-blur-md z-50 transition-all select-none">
      <div className="flex bg-black/40 backdrop-blur-2xl rounded-full py-2.5 px-6 border border-white/10 items-center justify-around gap-1 shadow-2xl">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
            activeTab === 'home'
              ? 'text-orange-500 scale-105 font-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Home className="w-5.2 h-5.2 stroke-[2.2]" />
          <span className="text-[9px] font-bold tracking-wider uppercase">{labels.home}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
            activeTab === 'search'
              ? 'text-orange-500 scale-105 font-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Search className="w-5.2 h-5.2 stroke-[2.2]" />
          <span className="text-[9px] font-bold tracking-wider uppercase">{labels.search}</span>
        </button>

        {/* Sell (Custom Center Highlighted button like willhaben / olx / lelami) */}
        <button
          onClick={() => onTabChange('sell')}
          className="flex-1 flex flex-col items-center justify-center -mt-8 transition-all duration-300 pointer-events-auto cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500 border-4 border-[#050505] flex items-center justify-center text-black shadow-lg shadow-orange-500/45 group-hover:scale-110 group-active:scale-90 transition-all">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span
            className={`text-[9px] font-bold tracking-wider uppercase mt-1 transition-colors duration-200 ${
              activeTab === 'sell' ? 'text-orange-400 font-extrabold' : 'text-white/50'
            }`}
          >
            {labels.sell}
          </span>
        </button>

        {/* Messages */}
        <button
          onClick={() => onTabChange('messages')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer relative ${
            activeTab === 'messages'
              ? 'text-orange-500 scale-105 font-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5.2 h-5.2 stroke-[2.2]" />
          <span className="text-[9px] font-bold tracking-wider uppercase">{labels.messages}</span>

          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-orange-600 rounded-full border border-black flex items-center justify-center text-[9px] font-extrabold text-black">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
            activeTab === 'profile'
              ? 'text-orange-500 scale-105 font-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <User className="w-5.2 h-5.2 stroke-[2.2]" />
          <span className="text-[9px] font-bold tracking-wider uppercase">{labels.profile}</span>
        </button>
      </div>
    </div>
  );
}
