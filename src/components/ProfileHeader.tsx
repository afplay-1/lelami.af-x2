import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import { User } from '../types';
import { toLocalNumbers } from '../lib/i18n';

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
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-[24px] border border-zinc-200/90 shadow-sm select-none">
      {/* Avatar with dynamic initials */}
      <div className="relative">
        <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-blue-700 to-blue-550 border-4 border-white flex items-center justify-center text-white text-2xl font-black shadow-md">
          {user.avatar}
        </div>

        {user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow">
            <ShieldCheck className="w-4 h-4 text-white fill-none stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* Seller Credentials */}
      <h3 className="text-zinc-900 font-black text-lg mt-3.5 tracking-tight flex items-center gap-1.5 justify-center">
        {user.name}
      </h3>
      <p className="text-zinc-500 text-xs mt-1 font-semibold">{user.location}</p>

      {user.isVerified && (
        <span className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 text-[10px] font-black">
          <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
          {labels.verified}
        </span>
      )}

      {/* Ratings stars */}
      <div className="flex items-center gap-1 mt-3">
        {starsArray.map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= Math.floor(user.rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'
            }`}
          />
        ))}
        <span className="text-zinc-650 text-xs font-black font-mono ml-1">{toLocalNumbers(String(user.rating.toFixed(1)), lang)}</span>
      </div>

      {/* User Stats Segment */}
      <div className="grid grid-cols-3 gap-1.5 w-full mt-5 pt-4 border-t border-zinc-200/90">
        <div className="flex flex-col items-center">
          <span className="text-blue-600 font-black font-mono text-base">{toLocalNumbers(String(user.listingsCount), lang)}</span>
          <span className="text-[10px] text-zinc-500 font-extrabold mt-0.5">{labels.listings}</span>
        </div>
        <div className="flex flex-col items-center border-x border-zinc-150">
          <span className="text-blue-600 font-black text-xs leading-6 truncate max-w-[90px] px-1 font-mono">
            {toLocalNumbers(user.responseTime.split(' ')[0], lang)}
          </span>
          <span className="text-[10px] text-zinc-500 font-extrabold mt-0.5">{labels.response}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-blue-600 font-black font-mono text-base">{toLocalNumbers(String(user.rating.toFixed(1)), lang)}★</span>
          <span className="text-[10px] text-zinc-500 font-extrabold mt-0.5">{labels.rating}</span>
        </div>
      </div>
    </div>
  );
}
