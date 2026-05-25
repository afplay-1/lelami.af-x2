import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Briefcase, MapPin, ChevronDown, Bell, Search } from 'lucide-react';
import { Listing, Job, CategoryID } from '../types';
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
}: HomeViewProps) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = React.useState(false);

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
          <div className="relative w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200/80 flex items-center justify-center text-zinc-750 cursor-pointer border border-zinc-200/50 transition-colors">
            <Bell className="w-[18px] h-[18px] text-zinc-700" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </div>

          <div
            onClick={() => onNavChange('profile')}
            className="w-9 h-9 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 flex items-center justify-center font-black text-sm cursor-pointer border border-emerald-600/20 shadow-sm transition-all"
          >
            ?
          </div>
        </div>
      </div>

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
    </div>
  );
}
