import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import { User } from '../types';

interface ProfileHeaderProps {
  user: User;
  lang: 'en' | 'da' | 'pa';
}

export default function ProfileHeader({ user, lang }: ProfileHeaderProps) {
  const starsArray = Array.from({ length: 5 }, (_, i) => i + 1);

  const labels = {
    verified: lang === 'en' ? 'Verified Partner' : lang === 'da' ? 'امانت‌دار تایید شده' : 'تایید شوی شراکت',
    listings: lang === 'en' ? 'Listings' : lang === 'da' ? 'آگهی‌ها' : 'رپوټونه',
    response: lang === 'en' ? 'Response rate' : lang === 'da' ? 'پاسخ‌دهی' : 'ځواب شرح',
    rating: lang === 'en' ? 'Rating' : lang === 'da' ? 'امتیاز' : 'کچه',
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 shadow-xl select-none">
      {/* Avatar with dynamic initials */}
      <div className="relative">
        <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 border-4 border-[#050505] flex items-center justify-center text-black text-2xl font-black shadow-lg shadow-orange-500/30">
          {user.avatar}
        </div>

        {user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-orange-500 text-black rounded-full p-1 border-2 border-[#050505] shadow">
            <ShieldCheck className="w-4 h-4 text-black fill-none stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* Seller Credentials */}
      <h3 className="text-zinc-100 font-black text-lg mt-3.5 tracking-tight flex items-center gap-1.5 justify-center">
        {user.name}
      </h3>
      <p className="text-zinc-450 text-xs mt-1 font-medium">{user.location}</p>

      {user.isVerified && (
        <span className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          {labels.verified}
        </span>
      )}

      {/* Ratings stars */}
      <div className="flex items-center gap-1 mt-3">
        {starsArray.map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= Math.floor(user.rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-650'
            }`}
          />
        ))}
        <span className="text-zinc-350 text-xs font-black font-mono ml-1">{user.rating}</span>
      </div>

      {/* User Stats Segment */}
      <div className="grid grid-cols-3 gap-1.5 w-full mt-5 pt-4 border-t border-white/10">
        <div className="flex flex-col items-center">
          <span className="text-orange-400 font-black font-mono text-base">{user.listingsCount}</span>
          <span className="text-[10px] text-zinc-400 font-extrabold mt-0.5">{labels.listings}</span>
        </div>
        <div className="flex flex-col items-center border-x border-[#252528]">
          <span className="text-orange-400 font-black text-xs leading-6 truncate max-w-[90px] px-1 font-mono">
            {user.responseTime.split(' ')[0]}
          </span>
          <span className="text-[10px] text-zinc-400 font-extrabold mt-0.5">{labels.response}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-amber-400 font-black font-mono text-base">{user.rating}★</span>
          <span className="text-[10px] text-zinc-400 font-extrabold mt-0.5">{labels.rating}</span>
        </div>
      </div>
    </div>
  );
}
