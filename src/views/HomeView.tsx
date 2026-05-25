import React from 'react';
import { Sparkles, ArrowRight, Briefcase, MapPin, ChevronDown, Bell, Search, X, Check, Trash2, Info, BellRing, ShieldCheck } from 'lucide-react';
import { Listing, Job, CategoryID, User } from '../types';
import CategoryPill from '../components/CategoryPill';
import ListingCard from '../components/ListingCard';
import JobCard from '../components/JobCard';
import { LanguageCode } from '../lib/i18n';
import { CATEGORIES } from '../data/categories';

interface HomeViewProps {
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  selectedCategory: CategoryID;
  onCategorySelect: (cat: CategoryID) => void;
  listings: Listing[];
  jobs: Job[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onListingSelect: (id: string) => void;
  onNavChange: (tab: string) => void;
  translations: any;
  selectedCity: string;
  onCityChange: (city: string) => void;
  currentUser: User | null;
}

const CITIES_LIST = [
  { id: 'all', name: 'All Cities', nameDari: 'کابل و تمام افغانستان', namePashto: 'ټول افغانستان' },
  { id: 'Kabul', name: 'Kabul', nameDari: 'کابل', namePashto: 'کابل' },
  { id: 'Herat', name: 'Herat', nameDari: 'هرات', namePashto: 'هرات' },
  { id: 'Balkh', name: 'Mazar-i-Sharif', nameDari: 'مزار شریف', namePashto: 'مزار شریف' },
  { id: 'Nangarhar', name: 'Jalalabad', nameDari: 'جلال‌آباد', namePashto: 'جلال اباد' },
  { id: 'Kandahar', name: 'Kandahar', nameDari: 'قندهار', namePashto: 'کندهار' },
  { id: 'Kunduz', name: 'Kunduz', nameDari: 'کندز', namePashto: 'کندز' },
  { id: 'Ghazni', name: 'Ghazni', nameDari: 'غزنی', namePashto: 'غزني' },
];

export default function HomeView({
  lang,
  onLanguageChange,
  selectedCategory,
  onCategorySelect,
  listings,
  jobs,
  favorites,
  onToggleFavorite,
  onListingSelect,
  onNavChange,
  translations,
  selectedCity,
  onCityChange,
  currentUser,
}: HomeViewProps) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState([
    {
      id: 'welcome',
      titleen: 'Welcome to Lelami!',
      titleda: 'به لیلامی خوش آمدید!',
      titlepa: 'لیلامي ته ښه راغلاست!',
      texten: "Afghanistan's modern classifieds engine: post ads for free, browse locally, and buy safely.",
      textda: 'بزرگترین موتور نیازمندی‌های صنف و بازار افغانستان. آگهی خود را رایگان ثبت کنید و با آرامش خرید کنید.',
      textpa: 'د افغانستان د اعلاناتو او توکو تر ټولو لوی پلورنځی. خپل اعلان په وړیا بڼه ثبت کړئ او په ډاډه زړه خریداري وکړئ.',
      timeen: 'Just now',
      timeda: 'هم‌اکنون',
      timepa: 'همدا اوس',
      isNew: true,
      category: 'welcome',
    },
    {
      id: 'security',
      titleen: 'Safety Alert: Guard Your Wallet',
      titleda: 'هشدار امنیتی: از کیف پول خود محافظت کنید',
      titlepa: 'امنیتي خبرتیا: خپلو پیسو ته پام وکړئ',
      texten: 'Never wire down payments or send advances of money before seeing or testing any item in real life!',
      textda: 'هرگز پیش‌پرداخت یا پول بیعانه بدون دیدن حضوری جنس در مکان‌های عمومی و امن پرداخت نکنید!',
      textpa: 'هیڅکله د توکي تر لیدلو او کتلو وړاندې مخکې تر مخکې پیسې یا بیعانه مه لیږئ!',
      timeen: '5 mins ago',
      timeda: '۵ دقیقه قبل',
      timepa: '۵ دقيقې مخکې',
      isNew: true,
      category: 'warning',
    },
    {
      id: 'phone_verification',
      titleen: 'Boost Your Seller Status',
      titleda: 'افزایش درجه و اعتبار فروشگاه شما',
      titlepa: 'د خپل پلورنځي کچه لوړه کړئ',
      texten: 'Add your active WhatsApp or phone number in Settings to build trust and receive direct chats from customers.',
      textda: 'شماره واتس‌اپ یا تماس فعال‌تان را در تنظیمات پروفایل وارد کنید تا مشتریان مستقیم با شما چت کنند.',
      textpa: 'خپل واټساپ یا موبایل شمیره اضافه کړئ ترڅو پیریدونکي په مستقیمه توګه درسره اړیکه ونیسي.',
      timeen: '1 hour ago',
      timeda: '۱ ساعت قبل',
      timepa: '۱ ساعت مخکې',
      isNew: false,
      category: 'tip',
    }
  ]);

  // Translate system categories dynamically from the categories definition
  const categories: { id: CategoryID; label: string }[] = [
    { id: 'all', label: translations.all || 'All' },
    ...CATEGORIES.map((cat) => ({
      id: cat.id as CategoryID,
      label: lang === 'da' ? cat.labelDari : lang === 'pa' ? cat.labelPashto : cat.label,
    })),
  ];

  // Filter listings based on selected categorization AND selected city/province
  const filteredListings = listings.filter((item) => {
    // 1. Category filter
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'phones' && item.category === 'electronics') ||
      (selectedCategory === 'cars' && item.category === 'vehicles') ||
      (selectedCategory === 'jobs' && item.category === 'jobs_services') ||
      (selectedCategory === 'livestock' && item.category === 'agriculture') ||
      (selectedCategory === 'services' && item.category === 'jobs_services');

    // 2. City filter matches item's province
    const matchesCity =
      selectedCity === 'all' ||
      item.province === selectedCity ||
      (selectedCity === 'Balkh' && item.location.toLowerCase().includes('mazar')) ||
      (selectedCity === 'Nangarhar' && item.location.toLowerCase().includes('jalalabad'));

    return matchesCategory && matchesCity;
  });

  const isRTL = lang === 'da' || lang === 'pa';
  const unreadCount = notifications.filter((n) => n.isNew).length;

  const activeCityObj = CITIES_LIST.find((c) => c.id === selectedCity) || CITIES_LIST[0];
  const activeCityName =
    lang === 'da' ? activeCityObj.nameDari : lang === 'pa' ? activeCityObj.namePashto : activeCityObj.name;

  return (
    <div className="flex flex-col flex-grow pb-20 text-zinc-900 select-none">
      {/* Upper Navigation / Status Block */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 text-zinc-850 flex-shrink-0" style={{ direction: 'ltr' }}>
        <div className="flex flex-col text-left">
          {/* City Selection Top Left Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-bold text-xs transition-colors cursor-pointer select-none"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeCityName}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isCityDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsCityDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-60 rounded-2xl bg-white border border-zinc-200/95 shadow-xl py-2 z-50 animate-scale-up text-left">
                  <div className="px-4 py-1.5 border-b border-zinc-100 mb-1.5 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400">
                      {lang === 'en' ? 'Select City / State' : 'انتخاب ولایت / شهر'}
                    </span>
                    {selectedCity !== 'all' && (
                      <button
                        onClick={() => {
                          onCityChange('all');
                          setIsCityDropdownOpen(false);
                        }}
                        className="text-[9px] text-blue-600 hover:underline font-bold"
                      >
                        {lang === 'en' ? 'Reset' : 'بازنشانی'}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {CITIES_LIST.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          onCityChange(city.id);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-xs font-semibold text-left hover:bg-zinc-50 flex items-center justify-between transition-colors ${
                          selectedCity === city.id ? 'text-blue-600 bg-blue-50/50 font-bold' : 'text-zinc-700'
                        }`}
                      >
                        <span>{lang === 'da' ? city.nameDari : lang === 'pa' ? city.namePashto : city.name}</span>
                        {selectedCity === city.id && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Slogan */}
          <h1 className="text-xl font-black text-zinc-900 tracking-tight mt-1">
            {lang === 'da' ? 'به لیلامی بزرگترین بازار خوش آمدید' : lang === 'pa' ? 'لیلامي ته ښه راغلاست' : 'Welcome to Lelami'}
          </h1>
        </div>
 
        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Notifications bell */}
          <div 
            onClick={() => setIsNotificationOpen(true)}
            className="relative w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200/80 flex items-center justify-center text-zinc-750 cursor-pointer border border-zinc-200/50 transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-zinc-700" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
            )}
          </div>

          <div
            onClick={() => onNavChange('profile')}
            className="w-9 h-9 rounded-full cursor-pointer overflow-hidden shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
          >
            {currentUser && currentUser.avatar && currentUser.avatar.length > 5 ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-full h-full object-cover border border-zinc-200 rounded-full" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-[11px] font-black uppercase border border-emerald-600/20">
                {currentUser?.avatar || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'GU')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Drawer Component */}
      {isNotificationOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end animate-fade-in" style={{ direction: 'ltr' }}>
          <div className="fixed inset-0" onClick={() => setIsNotificationOpen(false)} />
          <div 
            className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right z-50"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-150 border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-blue-600" />
                <span className="font-extrabold text-xs text-zinc-800 uppercase tracking-wider">
                  {lang === 'da' ? 'اعلان‌های مهم' : lang === 'pa' ? 'مهم خبرتیاوې' : 'Important Notices'}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === 'da' ? `${unreadCount} جدید` : lang === 'pa' ? `${unreadCount} نوی` : `${unreadCount} NEW`}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsNotificationOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-zinc-200/60 flex items-center justify-center text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 gap-3 text-zinc-400">
                  <Bell className="w-10 h-10 opacity-30 text-zinc-400" />
                  <span className="text-[11px] font-extrabold text-zinc-450 uppercase tracking-widest">
                    {lang === 'da' ? 'هیچ اعلانی جدیدی ندارید' : lang === 'pa' ? 'تاسو نوي خبرتیاوې نلرئ' : 'No active alerts'}
                  </span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isNew: false } : item));
                      setSelectedNotification(n);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 rounded-[20px] relative transition-all cursor-pointer ${
                      n.isNew 
                        ? 'bg-blue-500/5 border-blue-500/20 shadow-3xs' 
                        : 'bg-zinc-50 border-zinc-200/50 hover:bg-zinc-100/50'
                    }`}
                  >
                    {n.isNew && (
                      <span className="absolute top-4 right-4 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    )}
                    <div className="flex items-start gap-2.5">
                      {n.category === 'warning' ? (
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : n.category === 'welcome' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <BellRing className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-extrabold text-xs text-zinc-900 leading-tight">
                          {lang === 'da' ? n.titleda : lang === 'pa' ? n.titlepa : n.titleen}
                        </span>
                        <span className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                          {lang === 'da' ? n.textda : lang === 'pa' ? n.textpa : n.texten}
                        </span>
                        <span className="text-[8px] text-zinc-400 font-black mt-1 uppercase tracking-widest block font-sans">
                          {lang === 'da' ? n.timeda : lang === 'pa' ? n.timepa : n.timeen}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex gap-2">
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(item => ({ ...item, isNew: false })));
                  }}
                  className="flex-grow py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'da' ? 'تایید کل اعلان‌ها' : lang === 'pa' ? 'ټول لوستل شوي' : 'Mark all read'}</span>
                </button>
                <button
                  onClick={() => {
                    setNotifications([]);
                  }}
                  className="py-3 px-3 bg-zinc-200 hover:bg-red-650 hover:text-white text-zinc-600 rounded-xl transition-all cursor-pointer flex items-center justify-center aspect-square"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styled Search Button Preview Bar */}
      <div className="px-4 mt-2 mb-1.5">
        <div
          onClick={() => onNavChange('search')}
          className="w-full bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 rounded-2xl px-4 py-3 flex items-center gap-2.5 cursor-pointer text-zinc-400 hover:text-zinc-500 transition-all shadow-sm"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-xs font-semibold text-zinc-450">
            {lang === 'da'
              ? 'جستجو در موترها، موبایل‌ها، جایدادها...'
              : lang === 'pa'
              ? 'موټرونه، مبایلونه او جایدادونه لټون کړئ...'
              : 'Search cars, mobiles, real estate...'}
          </span>
        </div>
      </div>

      {/* Horizontal categories scroll */}
      <div
        className="flex gap-2.5 px-4 py-4 overflow-x-auto scrollbar-none scroll-smooth flex-shrink-0"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            id={cat.id}
            label={cat.label}
            isActive={selectedCategory === cat.id}
            onClick={() => onCategorySelect(cat.id)}
          />
        ))}
      </div>
       {/* "For You" Section Header */}
      <div className="flex justify-between items-center px-4 py-1 flex-shrink-0">
        <h3 className="text-base font-black text-zinc-900 flex items-center gap-1.5 leading-none">
          {translations.foryou}
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
        </h3>
        <button
          onClick={() => onNavChange('search')}
          className="text-xs text-blue-600 font-bold hover:underline py-1 px-2 hover:bg-blue-600/10 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
        >
          <span>{translations.seeAll}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* For You Scroller */}
      {filteredListings.length > 0 ? (
        <div
          className="flex gap-3.5 px-4 py-1.5 overflow-x-auto scrollbar-none scroll-smooth flex-shrink-0"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          {filteredListings.slice(0, 4).map((listing) => (
            <div key={listing.id} className="w-[170px] flex-shrink-0">
              <ListingCard
                listing={listing}
                lang={lang}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={(e) => onToggleFavorite(listing.id, e)}
                onClick={() => onListingSelect(listing.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-2">
          <div className="p-8 text-center bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 font-bold text-xs">
            {translations.noResults}
          </div>
        </div>
      )}

      {/* Job recommendations */}
      {selectedCategory === 'all' || selectedCategory === 'jobs' ? (
        <div className="flex flex-col mt-6 flex-shrink-0">
          <div className="flex justify-between items-center px-4 py-1">
            <h3 className="text-base font-black text-zinc-900 flex items-center gap-1.5 leading-none">
              {translations.jobRecommendations}
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </h3>
            <button
              onClick={() => onNavChange('search')}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{translations.seeAll}</span>
              <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div
            className="flex gap-3.5 px-4 py-3 overflow-x-auto scrollbar-none scroll-smooth"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                lang={lang}
                onClick={() => {
                  onNavChange('search');
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* "Browse Now" / Main Grid section */}
      <div className="flex flex-col mt-4">
        <div className="px-4 py-3 flex justify-between items-center">
          <h3 className="text-base font-black text-zinc-900">{translations.browseNow}</h3>
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
            {filteredListings.length} {lang === 'en' ? 'ACTIVE ADS' : lang === 'da' ? 'آگهی فعال' : 'ژوندي اعلانونه'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              lang={lang}
              isFavorite={favorites.includes(listing.id)}
              onToggleFavorite={(e) => onToggleFavorite(listing.id, e)}
              onClick={() => onListingSelect(listing.id)}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4" id="notification-detail-modal">
          <div className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl relative flex flex-col gap-4 text-zinc-800 animate-zoom-in">
            <button 
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className={`p-3 rounded-2xl ${
                selectedNotification.category === 'warning' 
                  ? 'bg-amber-100 text-amber-700' 
                  : selectedNotification.category === 'welcome' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedNotification.category === 'warning' ? (
                  <Info className="w-5 h-5" />
                ) : selectedNotification.category === 'welcome' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                  {selectedNotification.category === 'warning' ? 'Alert' : selectedNotification.category === 'welcome' ? 'Welcome' : 'Tip'}
                </span>
                <span className="font-extrabold text-[10px] text-zinc-500 block">
                  {lang === 'da' ? selectedNotification.timeda : lang === 'pa' ? selectedNotification.timepa : selectedNotification.timeen}
                </span>
              </div>
            </div>

            <h3 className="text-zinc-900 font-extrabold text-base leading-snug">
              {lang === 'da' ? selectedNotification.titleda : lang === 'pa' ? selectedNotification.titlepa : selectedNotification.titleen}
            </h3>

            <p className="text-zinc-650 text-xs font-semibold leading-relaxed">
              {lang === 'da' ? selectedNotification.textda : lang === 'pa' ? selectedNotification.textpa : selectedNotification.texten}
            </p>

            <div className="mt-2 flex flex-col gap-2">
              {selectedNotification.id === 'phone_verification' ? (
                <button
                  onClick={() => {
                    setSelectedNotification(null);
                    setIsNotificationOpen(false);
                    onNavChange('profile');
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl uppercase tracking-wider text-center cursor-pointer transition-colors shadow-xs"
                >
                  {lang === 'da' ? 'تنظیم شماره تماس' : lang === 'pa' ? 'خپل نمبر ترتیب کړئ' : 'Configure Phone Number'}
                </button>
              ) : selectedNotification.id === 'welcome' ? (
                <button
                  onClick={() => {
                    setSelectedNotification(null);
                    setIsNotificationOpen(false);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl uppercase tracking-wider text-center cursor-pointer transition-colors shadow-xs"
                >
                  {lang === 'da' ? 'شروع جستجو' : lang === 'pa' ? 'بدايت وکړئ' : 'Start Browsing'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedNotification(null);
                    setIsNotificationOpen(false);
                  }}
                  className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-black text-xs rounded-xl uppercase tracking-wider text-center cursor-pointer transition-colors shadow-xs"
                >
                  {lang === 'da' ? 'متوجه شدم' : lang === 'pa' ? 'زه پوه شوم' : 'I Understand'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
