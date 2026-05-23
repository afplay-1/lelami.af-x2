import React, { useState } from 'react';
import { Camera, CheckCircle2, Sparkles, MapPin, Grid, ShieldAlert, Home } from 'lucide-react';
import { Listing, Province, CategoryID, User } from '../types';

interface SellViewProps {
  lang: 'en' | 'da' | 'pa';
  onAddListing: (newListing: Partial<Listing>) => void;
  translations: any;
  currentUser: User | null;
  onNavChange: (tab: string) => void;
}

const CATEGORY_IMAGES: Record<string, string[]> = {
  market: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', // smart watch
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop', // designer glasses
  ],
  realestate: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop', // premium apartment
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop', // villa
  ],
  cars: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop', // luxury land cruiser suv
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop', // jeep
  ],
  jobs: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', // workplace office skyscraper
  ],
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop', // phone smartphone
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop', // macbook
  ],
  livestock: [
    'https://images.unsplash.com/photo-1484557985045-edd25e08da73?q=80&w=600&auto=format&fit=crop', // sheep
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600&auto=format&fit=crop', // horse
  ],
  services: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop', // electrician technician
  ],
};

export default function SellView({
  lang,
  onAddListing,
  translations,
  currentUser,
  onNavChange,
}: SellViewProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryID | ''>('');
  const [price, setPrice] = useState('');
  const [province, setProvince] = useState<Province | ''>('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Auto-fill phone of logged-in user if available to prevent re-typing
  React.useEffect(() => {
    if (currentUser?.phone) {
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const handlePostAd = () => {
    if (!title || !category || !price || !province || !phone) {
      setValidationError(
        lang === 'en'
          ? 'Please enter all required fields mark with (*)'
          : lang === 'da'
            ? 'لطفاً تمامی خانه‌های ستاره‌دار (*) را پر کنید'
            : 'مهرباني وکړئ ټول ستوري لرونکي خانې ډکې کړئ'
      );
      return;
    }
    setValidationError('');

    // Dynamically choose Unsplash graphics based on categories
    const categoryPics = CATEGORY_IMAGES[category as CategoryID] || [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop',
    ];
    const chosenPic = categoryPics[Math.floor(Math.random() * categoryPics.length)] || categoryPics[0];

    const newAd: Partial<Listing> = {
      title,
      titleDari: title,
      titlePashto: title,
      price: Number(price),
      category: category as CategoryID,
      province: province as Province,
      description: desc,
      descriptionDari: desc,
      descriptionPashto: desc,
      location: `${province}, Center`,
      locationDari: `${province}، مرکز`,
      locationPashto: `${province}، مرکز`,
      images: [chosenPic],
      postedTime: 'Just now',
      isVerified: false,
    };

    onAddListing(newAd);
    setSuccess(true);
  };

  const handleReset = () => {
    setTitle('');
    setCategory('');
    setPrice('');
    setProvince('');
    setDesc('');
    setPhone('');
    setSuccess(false);
  };

  // Safe category options for posting Ads
  const cats: { id: CategoryID; label: string }[] = [
    { id: 'market', label: translations.marketplace },
    { id: 'realestate', label: translations.realestate },
    { id: 'cars', label: translations.cars },
    { id: 'jobs', label: translations.jobs },
    { id: 'phones', label: translations.phones },
    { id: 'livestock', label: translations.livestock },
    { id: 'services', label: translations.services },
  ];

  const isRTL = lang === 'da' || lang === 'pa';

  // Authenticate walls for unregistered users
  if (!currentUser) {
    return (
      <div className="flex flex-col flex-grow pb-28 text-zinc-100 select-none px-4 pt-14 animate-fade-in justify-center items-center text-center mt-12">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-white">
          {lang === 'en'
            ? 'Sign In Required'
            : lang === 'da'
              ? 'ورود به حساب لازمی است'
              : 'حساب ته ننوتل اړین دي'}
        </h3>
        <p className="text-zinc-400 text-xs mt-2 max-w-[300px] leading-relaxed font-medium">
          {lang === 'en'
            ? 'Please create a profile or sign in first from the Profile tab to publish your classified ads on lelami.af securely'
            : lang === 'da'
              ? 'لطفاً ابتدا از بخش پروفایل وارد حساب کاربری خود شوید تا بتوانید آگهی تان را به نشر بسپارید.'
              : 'مهرباني وکړئ لومړی د پروفایل پاڼې څخه خپل حساب ته ننوځئ ترڅو خپل اعلانونه په خوندي ډول نشر کړئ.'}
        </p>
        <button
          onClick={() => onNavChange('profile')}
          className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
        >
          {lang === 'en' ? 'Go to Profile' : lang === 'da' ? 'ورود به حساب کاربری' : 'پروفایل ته تلل'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow pb-28 text-zinc-100 select-none px-4 pt-14 animate-fade-in">
      {!success ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-orange-500 tracking-tight">{translations.postAd}</h2>
            <p className="text-zinc-400 text-xs mt-1 font-semibold">{translations.freeToList}</p>
          </div>

          {/* Validation alert if exists */}
          {validationError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-3 rounded-xl">
              {validationError}
            </div>
          )}

          {/* Photo Drop area mock */}
          <div className="w-full bg-white/5 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-[24px] py-8 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-250 active:scale-98 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-3 border border-orange-500/20">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <h4 className="text-zinc-200 font-extrabold text-sm">{translations.photoDropTitle}</h4>
            <p className="text-zinc-500 text-[11px] mt-1.5 leading-relaxed">{translations.photoDropSub}</p>
          </div>

          {/* Core inputs fields list */}
          <div className="flex flex-col gap-3">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder={translations.adTitle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 placeholder-zinc-500 outline-none focus:border-orange-500/70 transition-colors backdrop-blur-md"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />
            </div>

            {/* Category Select custom */}
            <div className="flex flex-col gap-1.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryID)}
                className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-200 outline-none focus:border-orange-500/70 transition-colors cursor-pointer"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <option value="" className="text-zinc-500">
                  {translations.selectCategory}
                </option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price and Province grid */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={translations.pricePlaceholder}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 placeholder-zinc-500 outline-none focus:border-orange-500/70 transition-colors backdrop-blur-md"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              />

              <select
                value={province}
                onChange={(e) => setProvince(e.target.value as Province)}
                className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-200 outline-none focus:border-orange-500/70 transition-colors cursor-pointer"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <option value="" className="text-zinc-500 font-bold bg-[#101010]">
                  {translations.selectProvince}
                </option>
                <option value="Kabul" className="bg-[#101010]">Kabul - کابل</option>
                <option value="Herat" className="bg-[#101010]">Herat - هرات</option>
                <option value="Balkh" className="bg-[#101010]">Balkh - بلخ</option>
                <option value="Nangarhar" className="bg-[#101010]">Nangarhar - ننگرهار</option>
                <option value="Kandahar" className="bg-[#101010]">Kandahar - کندهار</option>
                <option value="Kunduz" className="bg-[#101010]">Kunduz - کندز</option>
                <option value="Ghazni" className="bg-[#101010]">Ghazni - غزنی</option>
                <option value="Kapisa" className="bg-[#101010]">Kapisa - کاپیسا</option>
                <option value="Logar" className="bg-[#101010]">Logar - لوگر</option>
              </select>
            </div>

            {/* Description textbox */}
            <textarea
              placeholder={translations.descriptionPlaceholder}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-100 placeholder-zinc-500 outline-none focus:border-orange-500/70 transition-colors h-24 resize-none backdrop-blur-md"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />

            {/* Phone contact */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 font-bold ml-1">
                {lang === 'en' ? 'Phone Verification *' : 'تایید شماره تماس *'}
              </span>
              <input
                type="tel"
                placeholder={translations.phoneNumber}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono font-bold text-zinc-100 placeholder-zinc-500 outline-none focus:border-orange-500/70 transition-colors backdrop-blur-md"
              />
            </div>
          </div>

          {/* Trigger submit */}
          <button
            onClick={handlePostAd}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-400 text-black font-extrabold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 active:scale-98 cursor-pointer text-center mt-2"
          >
            {translations.postAdButton}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-12 py-10 animate-scale-up select-none">
          <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-5">
            <CheckCircle2 className="w-10 h-10 animate-bounce text-orange-500" />
          </div>

          <h3 className="text-xl font-black text-zinc-50">{translations.adSuccessTitle}</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-[280px]">
            {translations.adSuccessSub}
          </p>

          <div className="flex flex-col gap-3.5 w-full max-w-[260px] mt-8">
            <button
              onClick={() => {
                handleReset();
                onNavChange('home');
              }}
              className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black rounded-xl transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>
                {lang === 'en' ? 'Go to Home Feed' : lang === 'da' ? 'بازگشت به خانه' : 'کور پاڼه'}
              </span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-95"
            >
              {translations.postAnotherAd}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
