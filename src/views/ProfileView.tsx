import React, { useState } from 'react';
import { ShieldCheck, Star, Bell, Settings, HelpCircle, LogOut, Heart, Eye, List, ShieldAlert, User as UserIcon, LogIn, ArrowRight } from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import { Listing, User, Province } from '../types';
import FavoritesView from './FavoritesView';

interface ProfileViewProps {
  lang: 'en' | 'da' | 'pa';
  onNavChange: (tab: string) => void;
  translations: any;
  listings: Listing[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onListingSelect: (id: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onLogin: (user: User) => void;
}

export default function ProfileView({
  lang,
  onNavChange,
  translations,
  listings,
  favorites,
  onToggleFavorite,
  onListingSelect,
  currentUser,
  onLogout,
  onLogin,
}: ProfileViewProps) {
  const [showSavedListings, setShowSavedListings] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState<Province | ''>('');
  const [loginError, setLoginError] = useState('');

  const isRTL = lang === 'da' || lang === 'pa';

  // Handle mock dynamic signup
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setLoginError(
        lang === 'en'
          ? 'Please enter your name.'
          : lang === 'da'
            ? 'لطفاً نام خود را وارد کنید.'
            : 'مهرباني وکړئ خپل نوم ولیکئ.'
      );
      return;
    }
    if (!phone.trim()) {
      setLoginError(
        lang === 'en'
          ? 'Please enter your phone number.'
          : lang === 'da'
            ? 'لطفاً شماره تماس خود را وارد کنید.'
            : 'مهرباني وکړئ خپل د تلیفون شمیره ولیکئ.'
      );
      return;
    }

    const initials = name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'GU';

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      avatar: initials,
      location: province ? `${province}, Center` : 'Kabul, Afghanistan',
      joinDate: '2026',
      isVerified: false,
      rating: 5.0,
      listingsCount: 0,
      responseTime: '100% inside 5 mins',
      phone: phone.trim(),
    };

    onLogin(newUser);
    setLoginError('');
  };

  if (showSavedListings) {
    return (
      <FavoritesView
        lang={lang}
        listings={listings}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onListingSelect={onListingSelect}
        translations={translations}
        onBack={() => setShowSavedListings(false)}
      />
    );
  }

  // If user is currently signed out, display dynamic beautifully designed authentication interface
  if (!currentUser) {
    return (
      <div className="flex flex-col flex-grow pb-28 text-zinc-100 select-none px-4 pt-14 animate-fade-in gap-4">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-orange-500 tracking-tight">
            {lang === 'en' ? 'Get Started' : lang === 'da' ? 'ورود و راه‌اندازی' : 'ننوتل او پیل کول'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">
            {lang === 'en'
              ? 'Join lelami.af to publish free classified ads and message buyers'
              : lang === 'da'
                ? 'به اولین و بزرگترین بازار آنلاین افغانستان بپیوندید'
                : 'د افغانستان لومړي او تر ټولو لوی آنلاین بازار سره یوځای شئ'}
          </p>
        </div>

        {/* Custom Login Card form */}
        <form
          onSubmit={handleRegister}
          className="bg-white/5 border border-white/10 rounded-[24px] p-5 flex flex-col gap-4 shadow-2xl backdrop-blur-md mt-2"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 mx-auto mb-1">
            <UserIcon className="w-5 h-5 animate-pulse-subtle" />
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
              {loginError}
            </div>
          )}

          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest text-left">
              {lang === 'en' ? 'Your Name *' : lang === 'da' ? 'نام و تخلص شما *' : 'ستاسو نوم او تخلص *'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Najibullah Afghan' : 'مثلاً: نجیب‌الله افغان'}
              className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 placeholder-zinc-600 outline-none focus:border-orange-500/50 transition-colors"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
          </div>

          {/* Phone input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest text-left">
              {lang === 'en' ? 'Phone Number *' : lang === 'da' ? 'شماره تماس *' : 'د تلیفون شمیره *'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+93 78 456 1234"
              className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono font-bold text-zinc-100 placeholder-zinc-650 outline-none focus:border-orange-500/50 transition-colors"
                style={{ direction: 'ltr' }}
            />
          </div>

          {/* Province selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest text-left">
              {lang === 'en' ? 'Your Province' : lang === 'da' ? 'ولایت شما' : 'ستاسو ولایت'}
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value as Province)}
              className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-200 outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <option value="" className="text-zinc-500">
                {translations.selectProvince}
              </option>
              <option value="Kabul" className="bg-[#101010]">Kabul - کابل</option>
              <option value="Herat" className="bg-[#101010]">Herat - هرات</option>
              <option value="Balkh" className="bg-[#101010]">Balkh - بلخ</option>
              <option value="Nangarhar" className="bg-[#101010]">Nangarhar - ننگرهار</option>
              <option value="Kandahar" className="bg-[#101010]">Kandahar - کندهار</option>
              <option value="Kunduz" className="bg-[#101010]">Kunduz - کندز</option>
              <option value="Ghazni" className="bg-[#101010]">Ghazni - غزنی</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-orange-600 to-orange-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-101 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {lang === 'en' ? 'Create Account & Sign In' : lang === 'da' ? 'ایجاد حساب کاربری و ورود' : 'اکاونټ جوړول او ننوتل'}
            </span>
          </button>
        </form>
      </div>
    );
  }

  // Active Authenticated Seller layout state
  return (
    <div className="flex flex-col flex-grow pb-28 text-zinc-100 select-none px-4 pt-14 animate-fade-in gap-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-orange-500 tracking-tight">{translations.profile}</h2>
      </div>

      {/* Seller Header cards with verified badges */}
      <ProfileHeader user={currentUser} lang={lang} />

      {/* Profile actions options lists */}
      <div className="flex flex-col gap-2 mt-2">
        {/* Saved Items */}
        <div
          onClick={() => setShowSavedListings(true)}
          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 cursor-pointer transition-colors"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Heart className="w-4.5 h-4.5 fill-red-500" />
          </div>
          <div className="flex-grow flex items-center justify-between">
            <span className="font-extrabold text-sm text-zinc-200">{translations.savedAds}</span>
            <span className="text-[11px] text-zinc-500 font-bold">›</span>
          </div>
        </div>

        {/* System Settings option */}
        <div
          onClick={() => console.log('Settings menu loaded. Configuration synced!')}
          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 cursor-pointer transition-colors"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Settings className="w-4.5 h-4.5" />
          </div>
          <div className="flex-grow flex items-center justify-between">
            <span className="font-extrabold text-sm text-zinc-200">{translations.settings}</span>
            <span className="text-[11px] text-zinc-500 font-bold">›</span>
          </div>
        </div>

        {/* Notifications push notifications mockup select Toggle */}
        <div
          onClick={() => console.log('Notification systems initialized!')}
          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 cursor-pointer transition-colors"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div className="flex-grow flex items-center justify-between">
            <span className="font-extrabold text-sm text-zinc-200">{translations.notifications}</span>
            <span className="text-[11px] text-zinc-500 font-bold">›</span>
          </div>
        </div>

        {/* Support guide helpful links */}
        <div
          onClick={() => console.log('Help documents loaded!')}
          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 cursor-pointer transition-colors"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <div className="flex-grow flex items-center justify-between">
            <span className="font-extrabold text-sm text-zinc-200">{translations.helpSupport}</span>
            <span className="text-[11px] text-zinc-500 font-bold">›</span>
          </div>
        </div>

        {/* Exit app / Disconnect fake trigger */}
        <div
          onClick={() => {
            onLogout();
            console.log('Session cleared. Logged out.');
          }}
          className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 cursor-pointer transition-colors mt-4"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <LogOut className="w-4.5 h-4.5" />
          </div>
          <div className="flex-grow flex items-center justify-between">
            <span className="font-extrabold text-sm text-red-500">
              {translations.signOut || 'Sign Out'}
            </span>
            <span className="text-[11px] text-red-500 font-bold">›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
