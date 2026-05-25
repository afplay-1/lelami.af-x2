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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-4 pt-2 bg-gradient-to-t from-zinc-100/80 to-transparent backdrop-blur-sm z-50 transition-all select-none">
      <div 
        className="flex bg-white/95 backdrop-blur-xl rounded-full py-2.5 px-5 border border-zinc-200/80 items-center justify-around gap-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        style={{ direction: 'ltr' }} // Enforces LTR tab sequencing under all locales (Home -> Search -> Sell -> Messages -> Profile)
      >
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
            activeTab === 'home'
              ? 'text-blue-600 scale-105 font-black'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase">{labels.home}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
            activeTab === 'search'
              ? 'text-blue-600 scale-105 font-black'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase">{labels.search}</span>
        </button>

        {/* Sell Button */}
        <button
          onClick={() => onTabChange('sell')}
          className="flex-1 flex flex-col items-center justify-center -mt-8 transition-all duration-300 pointer-events-auto cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white shadow-lg shadow-blue-500/35 group-hover:scale-110 group-active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span
            className={`text-[9px] font-extrabold tracking-wider uppercase mt-1 transition-colors duration-200 ${
              activeTab === 'sell' ? 'text-blue-600 font-extrabold' : 'text-zinc-400'
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
              ? 'text-blue-600 scale-105 font-black'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase">{labels.messages}</span>

          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-3.5 w-4.5 h-4.5 bg-blue-600 rounded-full border border-white flex items-center justify-center text-[9px] font-black text-white shadow-sm">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl gap-0.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
            activeTab === 'profile'
              ? 'text-blue-600 scale-105 font-black'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase">{labels.profile}</span>
        </button>
      </div>
    </div>
  );
}
