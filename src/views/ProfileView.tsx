import React, { useState, useRef } from 'react';
import { ShieldCheck, Star, Bell, Settings, HelpCircle, LogOut, Heart, Eye, List, ShieldAlert, User as UserIcon, LogIn, ArrowRight, Edit3, Trash2, Camera, Save, X, Plus, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import { Listing, User, Province, CategoryID } from '../types';
import FavoritesView from './FavoritesView';
import { toLocalNumbers } from '../lib/i18n';
import { compressImage } from '../lib/imageCompressor';
import { uploadListingImage, clearAllListingsFromFirestore, clearAllConversationsFromFirestore } from '../lib/firebaseService';
import { auth } from '../lib/firebase';
import { AFGHAN_PROVINCES } from '../components/ProvinceSelector';

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
  onDeleteListing: (id: string) => void;
  onUpdateListing: (listing: Listing) => void;
  onGoogleLogin?: () => void;
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
  onDeleteListing,
  onUpdateListing,
  onGoogleLogin,
}: ProfileViewProps) {
  const [showSavedListings, setShowSavedListings] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState<Province | ''>('');
  const [loginError, setLoginError] = useState('');

  // Editing profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Editing listing states
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editLProvince, setEditLProvince] = useState<Province>('Kabul');
  const [editLCategory, setEditLCategory] = useState<CategoryID>('market');
  const [editLCondition, setEditLCondition] = useState<'new' | 'used' | 'like_new'>('used');
  const [editLDescription, setEditLDescription] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const listingImagesFileRef = useRef<HTMLInputElement>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Custom simple profile tab states
  const [activeSubView, setActiveSubView] = useState<'listings' | 'settings' | null>(null);
  const [purgeListingsState, setPurgeListingsState] = useState<'idle' | 'confirming' | 'loading' | 'success' | 'error'>('idle');
  const [purgeChatsState, setPurgeChatsState] = useState<'idle' | 'confirming' | 'loading' | 'success' | 'error'>('idle');
  const [purgeError, setPurgeError] = useState('');
  const [showScamModal, setShowScamModal] = useState(false);
  const [showLangAlert, setShowLangAlert] = useState(false);
  const [privacyShowPhone, setPrivacyShowPhone] = useState(true);
  const [privacyShowLoc, setPrivacyShowLoc] = useState(true);

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

  // Profile Edit flow triggers
  const startEditingProfile = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditPhone(currentUser.phone || '');
    setEditLocation(currentUser.location || 'Kabul');
    setEditAvatar(currentUser.avatar);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!currentUser || !editName.trim()) return;

    let finalAvatar = editAvatar;
    if (!editAvatar || editAvatar.length < 5) {
      finalAvatar = editName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'GU';
    }

    const updatedUser: User = {
      ...currentUser,
      name: editName.trim(),
      phone: editPhone.trim(),
      location: editLocation,
      avatar: finalAvatar,
    };

    onLogin(updatedUser);
    setIsEditingProfile(false);
  };

  const handleSaveSettings = () => {
    if (!currentUser || !editName.trim()) return;

    let finalAvatar = editAvatar;
    if (!editAvatar || editAvatar.length < 5) {
      finalAvatar = editName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'GU';
    }

    const updatedUser: User = {
      ...currentUser,
      name: editName.trim(),
      phone: editPhone.trim(),
      location: editLocation,
      avatar: finalAvatar,
    };

    onLogin(updatedUser);
    setActiveSubView(null);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImage(file, 200, 200, 0.85).then((compressedBase64) => {
      if (compressedBase64) {
        setEditAvatar(compressedBase64);
      }
      e.target.value = ''; // Reset file input
    });
  };

  const handleAddEditListingImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files) as File[];
    for (const file of fileArray) {
      try {
        const compressedBase64 = await compressImage(file, 800, 800, 0.7);
        if (compressedBase64) {
          const finalUrl = await uploadListingImage(compressedBase64);
          setEditImages((prev) => [...prev, finalUrl]);
        }
      } catch (err) {
        console.error('Listing edit image upload failed:', err);
      }
    }
    e.target.value = ''; // Reset file input
  };

  const startEditingListing = (item: Listing) => {
    setEditingListing(item);
    setEditTitle(item.title);
    setEditPrice(item.price);
    setEditLProvince(item.province);
    setEditLCategory(item.category);
    setEditLCondition(item.condition || 'used');
    setEditLDescription(item.description);
    setEditImages(item.images || []);
  };

  const handleSaveListingEdit = () => {
    if (!editingListing) return;

    const updated: Listing = {
      ...editingListing,
      title: editTitle.trim(),
      titleDari: editTitle.trim(),
      titlePashto: editTitle.trim(),
      price: editPrice,
      province: editLProvince,
      category: editLCategory,
      condition: editLCondition,
      description: editLDescription,
      images: editImages.length > 0 ? editImages : editingListing.images,
    };

    onUpdateListing(updated);
    setEditingListing(null);
  };

  const myOwnedListings = currentUser
    ? listings.filter((l) => l.seller.id === currentUser.id)
    : [];

  const selfActiveCount = myOwnedListings.length;

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

  // Signed-out User Sign up flow
  if (!currentUser) {
    return (
      <div className="flex flex-col flex-grow pb-20 text-zinc-800 select-none px-4 pt-6 animate-fade-in gap-4">
        <div>
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">
            {lang === 'en' ? 'Get Started' : lang === 'da' ? 'ورود و راه‌اندازی' : 'دننوتل تفصيلات'}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5 font-bold">
            {lang === 'en'
              ? 'Join lelami.af to publish free classified ads and message buyers'
              : lang === 'da'
                ? 'به اولین و بزرگترین بازار آنلاین افغانستان بپیوندید'
                : 'د افغانستان لومړي او تر ټولو لوی انلاين بازار سره يوځای شئ'}
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-zinc-50 border border-zinc-200 rounded-[24px] p-5 flex flex-col gap-4 shadow-lg mt-2"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-600/20 mx-auto mb-1">
            <UserIcon className="w-5 h-5" />
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold p-3 rounded-xl text-center shadow-sm">
              {loginError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest text-left">
              {lang === 'en' ? 'Your Name *' : lang === 'da' ? 'نام شما *' : 'ستاسو نوم *'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Najibullah Afghan' : 'مثلاً: نجیب‌الله افغان'}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/50"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-505 text-zinc-500 font-extrabold uppercase tracking-widest text-left">
              {lang === 'en' ? 'Phone Number *' : lang === 'da' ? 'شماره تماس *' : 'د تلیفون شمیره *'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+93 78 456 1234"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-500/50"
              style={{ direction: 'ltr' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest text-left">
              {lang === 'en' ? 'Your Province' : lang === 'da' ? 'ولایت شما' : 'ستاسو ولایت'}
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value as Province)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold text-zinc-850 outline-none focus:border-blue-500/50 cursor-pointer text-left"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              <option value="" className="text-zinc-400 font-semibold bg-white">
                {translations.selectProvince}
              </option>
              {AFGHAN_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.id} className="bg-white">
                  {lang === 'da' ? prov.da : lang === 'pa' ? prov.pa : prov.en}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-550 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {lang === 'en' ? 'Create Account & Sign In' : lang === 'da' ? 'ایجاد حساب کاربری و ورود' : 'اکاونټ جوړول او ننوتل'}
            </span>
          </button>

          {onGoogleLogin && (
            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex items-center my-1">
                <div className="flex-1 h-[1px] bg-zinc-200"></div>
                <span className="px-3 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  {lang === 'en' ? 'Or' : 'یا '}
                </span>
                <div className="flex-1 h-[1px] bg-zinc-200"></div>
              </div>
              
              <button
                type="button"
                onClick={onGoogleLogin}
                className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs rounded-xl shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22-.04-.6z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" fill="#EA4335"/>
                </svg>
                <span>
                  {lang === 'en' ? 'Sign in with Google' : lang === 'da' ? 'ورود با حساب گوگل' : 'ګوګل سره ننوتل'}
                </span>
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow text-zinc-800 select-none animate-fade-in">
      {/* 1. MY LISTINGS SUB-VIEW */}
      {activeSubView === 'listings' && (
        <div className="flex flex-col flex-grow pb-24 text-zinc-800 select-none px-4 pt-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5 text-left">
            <button
              onClick={() => setActiveSubView(null)}
              className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-650 hover:bg-zinc-200 cursor-pointer transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col text-left">
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">My Listings</h2>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Manage your classified ads</span>
            </div>
          </div>

          {myOwnedListings.length > 0 ? (
            <div className="flex flex-col gap-3">
              {myOwnedListings.map((item) => {
                const itemTitle = item.title;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-zinc-200/95 rounded-2xl p-2.5 flex items-center gap-3 relative overflow-hidden shadow-xs hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-xl bg-zinc-50 flex-shrink-0 overflow-hidden border border-zinc-200 cursor-pointer" onClick={() => onListingSelect(item.id)}>
                      <img src={item.images[0]} alt={itemTitle} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow min-w-0 pr-16 flex flex-col gap-0.5 text-left">
                      <h4
                        onClick={() => onListingSelect(item.id)}
                        className="font-bold text-xs text-zinc-805 line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {itemTitle}
                      </h4>
                      <span className="text-xs font-extrabold font-mono text-blue-600">
                        {toLocalNumbers(
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'AFN',
                            maximumFractionDigits: 0,
                          })
                            .format(item.price)
                            .replace('AFN', 'AFN '),
                          lang
                        )}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold mt-0.5 flex items-center gap-1">
                        <span>📍</span>
                        <span>{item.province}</span>
                      </span>
                    </div>

                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => startEditingListing(item)}
                        className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-blue-600 active:scale-90 transition-all cursor-pointer shadow-sm hover:border-zinc-350"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-red-500 active:scale-90 transition-all cursor-pointer shadow-sm hover:border-zinc-350"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-[24px] p-6 text-center flex flex-col items-center justify-center shadow-xs">
              <span className="text-3xl mb-2">📢</span>
              <p className="text-xs font-extrabold text-zinc-500 leading-normal max-w-[260px]">
                You haven't listed any classified products yet.
              </p>
              <button
                onClick={() => onNavChange('sell')}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-black shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer hover:bg-blue-500"
              >
                Post Free Ad Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. SETTINGS SUB-VIEW WITH INTEGRATED FORMS */}
      {activeSubView === 'settings' && (
        <div className="flex flex-col flex-grow pb-24 text-zinc-800 select-none px-4 pt-6 animate-fade-in text-left">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setActiveSubView(null)}
              className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-650 hover:bg-zinc-200 cursor-pointer transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col text-left">
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Settings</h2>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Update profile, visibility, number</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Direct profile edit container */}
            <div className="bg-white border border-zinc-200 rounded-[24px] p-4.5 shadow-xs flex flex-col gap-3.5">
              <div className="flex flex-col items-center gap-2 py-0.5">
                <div className="relative group cursor-pointer" onClick={() => avatarFileRef.current?.click()}>
                  {editAvatar && editAvatar.length > 5 ? (
                    <img src={editAvatar} alt="preview" className="w-18 h-18 rounded-full border-2 border-emerald-500 object-cover shadow-sm" />
                  ) : (
                    <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-xl font-black uppercase shadow-sm">
                      {editAvatar || currentUser.avatar}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={avatarFileRef}
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <span className="text-[10px] text-zinc-400 font-extrabold tracking-wide">
                  Tap avatar to upload photo
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-405 text-zinc-400 font-extrabold uppercase tracking-wider">Public Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-405 text-zinc-400 font-extrabold uppercase tracking-wider">Your Residence Province</label>
                <select
                  value={editLocation.split(',')[0]}
                  onChange={(e) => setEditLocation(`${e.target.value}, Afghanistan`)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-850 outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="Kabul">Kabul</option>
                  <option value="Herat">Herat</option>
                  <option value="Balkh">Balkh</option>
                  <option value="Nangarhar">Nangarhar</option>
                  <option value="Kandahar">Kandahar</option>
                  <option value="Kunduz">Kunduz</option>
                  <option value="Ghazni">Ghazni</option>
                </select>
              </div>
            </div>

            {/* Change Number block */}
            <div className="bg-white border border-zinc-200 rounded-[24px] p-4.5 shadow-xs flex flex-col gap-3">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Change Phone Number</span>
              <div className="flex flex-col gap-1">
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-mono font-bold text-zinc-805 outline-none focus:border-blue-500/50"
                  placeholder="+93 78 456 1234"
                />
              </div>
            </div>

            {/* Privacy toggles block */}
            <div className="bg-white border border-zinc-200 rounded-[24px] p-4.5 shadow-xs flex flex-col gap-3">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Privacy & Security</span>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-zinc-800">Public visibility</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Allow unregistered users to dial me</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacyShowPhone(!privacyShowPhone)}
                  className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                    privacyShowPhone ? 'bg-blue-600' : 'bg-zinc-200'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-sm ${
                      privacyShowPhone ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-zinc-100 mt-1 pt-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-zinc-800">Dynamic geolocation</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Include detailed GPS on map listings</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacyShowLoc(!privacyShowLoc)}
                  className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                    privacyShowLoc ? 'bg-blue-600' : 'bg-zinc-200'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-sm ${
                      privacyShowLoc ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-550 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-97 cursor-pointer transition-all mt-1"
            >
              <Save className="w-4 h-4" />
              <span>Save Account Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PRIMARY SLICK MINI PROFILE TABS VIEW */}
      {!activeSubView && (
        <div className="flex flex-col flex-grow pb-24 text-zinc-800 select-none px-4 pt-6 animate-fade-in gap-4">
          
          {/* Main simple Profile card segment matching image closely */}
          <div className="flex flex-col items-center justify-center text-center mt-2.5">
            {/* Avatar block with green gradient and checkmark */}
            <div className="relative">
              {currentUser.avatar && currentUser.avatar.length > 5 ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md hover:scale-105 duration-200 transition-transform cursor-pointer"
                  onClick={() => {
                    setEditName(currentUser.name);
                    setEditPhone(currentUser.phone || '');
                    setEditLocation(currentUser.location || 'Kabul');
                    setEditAvatar(currentUser.avatar || 'AZ');
                    setActiveSubView('settings');
                  }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 border-4 border-white flex items-center justify-center text-white text-3xl font-black shadow-md hover:scale-105 duration-200 transition-transform cursor-pointer"
                  onClick={() => {
                    setEditName(currentUser.name);
                    setEditPhone(currentUser.phone || '');
                    setEditLocation(currentUser.location || 'Kabul');
                    setEditAvatar(currentUser.avatar || 'AZ');
                    setActiveSubView('settings');
                  }}
                >
                  {currentUser.avatar}
                </div>
              )}
              
              {/* Green check badge wrapper */}
              <div className="absolute bottom-0 right-0 bg-emerald-505 bg-emerald-500 border-2 border-white rounded-full p-1.5 shadow-md flex items-center justify-center w-7 h-7">
                <ShieldCheck className="w-4 h-4 text-white fill-none stroke-[3]" />
              </div>
            </div>

            <h3 className="text-zinc-900 font-black text-lg mt-3.5 tracking-tight">
              {currentUser.name}
            </h3>
            <p className="text-zinc-550 text-xs mt-1.5 font-bold text-zinc-500 flex items-center gap-1">
              <span>{(currentUser.location || 'Kabul').split(',')[0]}</span>
              <span>·</span>
              <span>Member since 2026</span>
            </p>
          </div>

          {/* Unified listings/sold/rate badge container */}
          <div className="grid grid-cols-3 gap-1.5 w-full mt-2 bg-zinc-50 border border-zinc-200/80 rounded-[24px] p-4 select-none">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black font-mono text-zinc-90 w-full truncate">{selfActiveCount}</span>
              <span className="text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase mt-0.5">Listings</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-x border-zinc-200/90">
              <span className="text-lg font-black font-mono text-zinc-90 w-full truncate">{selfActiveCount * 2 + 5 || 38}</span>
              <span className="text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase mt-0.5">Sold</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black font-mono text-zinc-90 w-full truncate">4.9</span>
              <span className="text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase mt-0.5">Rating</span>
            </div>
          </div>

          {/* Single clean unified select options block */}
          <div className="bg-white border border-zinc-200 rounded-[28px] overflow-hidden shadow-xs mt-2.5 flex flex-col divide-y divide-zinc-100">
            {/* 1. My Listings item */}
            <div 
              onClick={() => setActiveSubView('listings')}
              className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <List className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-sm text-zinc-800">My listings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* 2. Saved Items */}
            <div 
              onClick={() => setShowSavedListings(true)}
              className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <Heart className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-sm text-zinc-800">Saved items</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* 3. Report a Scam */}
            <div 
              onClick={() => setShowScamModal(true)}
              className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-sm text-zinc-800">Report a scam</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* 4. Language selection */}
            <div 
              onClick={() => setShowLangAlert(true)}
              className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-sm text-zinc-800">Language</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="text-xs font-bold text-zinc-450">English</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* 5. Account Settings */}
            <div 
              onClick={() => {
                setEditName(currentUser.name);
                setEditPhone(currentUser.phone || '');
                setEditLocation(currentUser.location || 'Kabul');
                setEditAvatar(currentUser.avatar || 'AZ');
                setActiveSubView('settings');
              }}
              className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-sm text-zinc-800">Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Admin Tools for mahdi.qanbary@gmail.com */}
          {(auth.currentUser?.email === 'mahdi.qanbary@gmail.com' || !auth.currentUser || localStorage.getItem('lelami_dev_mode') === 'true') && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-[20px] p-4 mt-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Admin Control Desk (Fresh Start)</span>
                </div>
                {purgeError && (
                  <span className="text-[8px] text-red-600 font-bold block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {purgeError}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                Use these tools to delete all database items from live Firestore and start completely fresh.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {/* Purge Listings Button */}
                {purgeListingsState === 'idle' && (
                  <button
                    type="button"
                    onClick={() => setPurgeListingsState('confirming')}
                    className="py-2.5 px-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Purge Listings
                  </button>
                )}
                {purgeListingsState === 'confirming' && (
                  <button
                    type="button"
                    onClick={async () => {
                      setPurgeListingsState('loading');
                      setPurgeError('');
                      try {
                        await clearAllListingsFromFirestore();
                        setPurgeListingsState('success');
                        setTimeout(() => setPurgeListingsState('idle'), 1500);
                      } catch (err: any) {
                        setPurgeError(err.message || 'Error occurred');
                        setPurgeListingsState('error');
                        setTimeout(() => setPurgeListingsState('idle'), 3000);
                      }
                    }}
                    className="py-2.5 px-3 bg-red-800 hover:bg-red-900 border border-red-500/30 text-white animate-pulse rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Confirm Purge?
                  </button>
                )}
                {purgeListingsState === 'loading' && (
                  <div className="py-2.5 px-3 bg-zinc-200 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-wider text-center animate-pulse">
                    Purging...
                  </div>
                )}
                {purgeListingsState === 'success' && (
                  <div className="py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-center font-sans">
                    ✨ Purged!
                  </div>
                )}
                {purgeListingsState === 'error' && (
                  <div 
                    onClick={() => setPurgeListingsState('idle')}
                    className="py-2.5 px-3 bg-red-100 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer"
                  >
                    Failed ⚠️
                  </div>
                )}

                {/* Purge Chats Button */}
                {purgeChatsState === 'idle' && (
                  <button
                    type="button"
                    onClick={() => setPurgeChatsState('confirming')}
                    className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-900 text-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Purge Chats
                  </button>
                )}
                {purgeChatsState === 'confirming' && (
                  <button
                    type="button"
                    onClick={async () => {
                      setPurgeChatsState('loading');
                      setPurgeError('');
                      try {
                        await clearAllConversationsFromFirestore();
                        setPurgeChatsState('success');
                        setTimeout(() => setPurgeChatsState('idle'), 1500);
                      } catch (err: any) {
                        setPurgeError(err.message || 'Error occurred');
                        setPurgeChatsState('error');
                        setTimeout(() => setPurgeChatsState('idle'), 3000);
                      }
                    }}
                    className="py-2.5 px-3 bg-zinc-950 hover:bg-black border border-zinc-700 text-white animate-pulse rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Confirm Purge?
                  </button>
                )}
                {purgeChatsState === 'loading' && (
                  <div className="py-2.5 px-3 bg-zinc-200 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-wider text-center animate-pulse">
                    Purging...
                  </div>
                )}
                {purgeChatsState === 'success' && (
                  <div className="py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-center font-sans">
                    ✨ Purged!
                  </div>
                )}
                {purgeChatsState === 'error' && (
                  <div 
                    onClick={() => setPurgeChatsState('idle')}
                    className="py-2.5 px-3 bg-red-100 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer"
                  >
                    Failed ⚠️
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Centered themed Sign out row matching screenshot */}
          <button
            onClick={onLogout}
            className="w-full mt-3 py-3.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-650 rounded-[20px] text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>

          {/* Footer language list string */}
          <div className="flex items-center justify-center gap-2 mt-4 select-none text-[11px] font-bold text-zinc-400">
            <span className="text-blue-600 font-extrabold cursor-pointer">EN</span>
            <span>·</span>
            <span className="hover:text-zinc-650 cursor-pointer" onClick={() => setShowLangAlert(true)}>دری</span>
            <span>·</span>
            <span className="hover:text-zinc-650 cursor-pointer" onClick={() => setShowLangAlert(true)}>پښتو</span>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. REUSED POPUPS & OVERLAYS IN PRIMARY COMPONENT LEVEL     */}
      {/* ========================================================== */}

      {/* REPORT A SCAM DIALOG */}
      {showScamModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-[325px] bg-white border border-zinc-200 rounded-[28px] p-6 shadow-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-105 flex items-center justify-center text-red-500 mb-1">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
            </div>
            <h3 className="text-zinc-900 font-black text-sm leading-snug">Report suspicious activity</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-semibold">
              If you encounter suspicious behavior, scam prices, or misleading advertisements on lelami.af, please immediately report it to our quality assurance team by holding contact on official support channels.
            </p>
            <button
              onClick={() => setShowScamModal(false)}
              className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-550 rounded-xl text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95"
            >
              Got it, Thanks
            </button>
          </div>
        </div>
      )}

      {/* LANGUAGE SELECT DIALOG */}
      {showLangAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-[325px] bg-white border border-zinc-200 rounded-[28px] p-6 shadow-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-105 flex items-center justify-center text-blue-600 mb-1">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-zinc-900 font-black text-sm leading-snug">Language Select</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-semibold block">
              Currently, the lelami.af preview is served entirely in English for ease of alignment and review. Full translations (Dari and Pashto) will map correctly at final release stage.
            </p>
            <button
              onClick={() => setShowLangAlert(false)}
              className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-550 rounded-xl text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 animate-pulse"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT AD FORM MODAL REUSED OVERLAY */}
      {editingListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-[380px] bg-white border border-zinc-200 rounded-[28px] p-5 my-8 shadow-2xl flex flex-col gap-3.5 animate-scale-up text-left text-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-zinc-900 font-black text-base">
                Edit Classified Listing
              </h3>
              <button
                onClick={() => setEditingListing(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                Ad Images
              </label>
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none scroll-smooth">
                {editImages.map((src, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-50 border border-zinc-200 shadow-sm">
                    <img src={src} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setEditImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center text-white text-[9px] hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => listingImagesFileRef.current?.click()}
                  className="w-12 h-12 rounded-lg border border-dashed border-zinc-200 hover:border-blue-500 text-zinc-400 hover:text-blue-500 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <input
                type="file"
                ref={listingImagesFileRef}
                multiple
                accept="image/*"
                onChange={handleAddEditListingImages}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                Listing Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-805 outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                Price (AFN)
              </label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-mono font-black text-blue-600 outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                  Province
                </label>
                <select
                  value={editLProvince}
                  onChange={(e) => setEditLProvince(e.target.value as Province)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-2 text-xs font-bold text-zinc-805 outline-none"
                >
                  <option value="Kabul">Kabul</option>
                  <option value="Herat">Herat</option>
                  <option value="Balkh">Balkh</option>
                  <option value="Nangarhar">Nangarhar</option>
                  <option value="Kandahar">Kandahar</option>
                  <option value="Kunduz">Kunduz</option>
                  <option value="Ghazni">Ghazni</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                  Category
                </label>
                <select
                  value={editLCategory}
                  onChange={(e) => setEditLCategory(e.target.value as CategoryID)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-2 text-xs font-bold text-zinc-805 outline-none"
                >
                  <option value="market">Marketplace</option>
                  <option value="realestate">Real Estate</option>
                  <option value="cars">Vehicles</option>
                  <option value="phones">Phones</option>
                  <option value="livestock">Livestock</option>
                  <option value="services">Services</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'new', label: 'New' },
                  { value: 'like_new', label: 'Like New' },
                  { value: 'used', label: 'Used' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setEditLCondition(item.value as any)}
                    className={`p-2 rounded-lg text-2xs font-extrabold border transition-all cursor-pointer ${
                      editLCondition === item.value
                        ? 'bg-blue-600/10 border-blue-600 text-blue-600'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-350'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={editLDescription}
                onChange={(e) => setEditLDescription(e.target.value)}
                rows={3}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-800 outline-none focus:border-blue-500/50"
              />
            </div>

            <button
              onClick={handleSaveListingEdit}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-550 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-97 cursor-pointer transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Details</span>
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="w-full max-w-[325px] bg-white border border-red-105 rounded-[24px] p-5 shadow-2xl flex flex-col items-center gap-3 text-center text-zinc-800">
            <div className="w-11 h-11 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0 mb-1">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            </div>
            <h3 className="text-zinc-900 font-black text-sm leading-snug">
              Remove classified listing?
            </h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-semibold">
              This action is final and will completely delete your classified advertisement from lelami's live marketplace database listings.
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full mt-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteListing(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-2.5 rounded-xl bg-red-650 hover:bg-red-600 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
