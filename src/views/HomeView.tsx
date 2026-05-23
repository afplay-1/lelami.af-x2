import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import { Listing, Job, CategoryID } from '../types';
import CategoryPill from '../components/CategoryPill';
import ListingCard from '../components/ListingCard';
import JobCard from '../components/JobCard';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { LanguageCode } from '../lib/i18n';

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
}

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
}: HomeViewProps) {
  // Translate system categories
  const categories: { id: CategoryID; label: string }[] = [
    { id: 'all', label: translations.all },
    { id: 'market', label: translations.marketplace },
    { id: 'realestate', label: translations.realestate },
    { id: 'cars', label: translations.cars },
    { id: 'jobs', label: translations.jobs },
    { id: 'phones', label: translations.phones },
    { id: 'livestock', label: translations.livestock },
    { id: 'services', label: translations.services },
  ];

  // Filter listings based on selected categorization
  const filteredListings =
    selectedCategory === 'all'
      ? listings
      : listings.filter(
          (item) => item.category === selectedCategory || (selectedCategory === 'phones' && item.category === 'phones')
        );

  const isRTL = lang === 'da' || lang === 'pa';

  return (
    <div className="flex flex-col flex-grow pb-28 text-white select-none">
      {/* Upper Navigation / Status Block */}
      <div className="flex items-center justify-between px-4 pt-14 pb-2 text-zinc-100 flex-shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-normal text-zinc-405 leading-none tracking-tight">
            {lang === 'en' ? 'Welcome to' : lang === 'da' ? 'خوش آمدید به' : 'ښه راغلاست'}
          </h2>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            lelami<span className="text-orange-500">.af</span>
          </h1>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
          <div
            onClick={() => onNavChange('profile')}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-orange-500 flex items-center justify-center font-extrabold text-sm text-orange-400 cursor-pointer backdrop-blur-md"
          >
            AZ
          </div>
        </div>
      </div>

      {/* Expiry Header Notice */}
      <div className="mx-4 mt-2 px-3.5 py-2.5 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 rounded-xl font-bold flex items-center justify-between shadow-sm">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
          <span>{translations.subExpiry}</span>
        </span>
        <button
          onClick={() => onNavChange('sell')}
          className="underline hover:text-amber-400 active:scale-95 transition-all cursor-pointer font-black"
        >
          {lang === 'en' ? 'Manage' : lang === 'da' ? 'مدیریت' : 'اصلاحول'}
        </button>
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
        <h3 className="text-base font-black text-zinc-100 flex items-center gap-1.5 leading-none">
          {translations.foryou}
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </h3>
        <button
          onClick={() => onNavChange('search')}
          className="text-xs text-orange-500 font-bold hover:underline py-1 px-2 hover:bg-orange-500/10 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
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
          <div className="p-8 text-center bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-500 font-bold text-xs">
            {translations.noResults}
          </div>
        </div>
      )}

      {/* Job recommendations */}
      {selectedCategory === 'all' || selectedCategory === 'jobs' ? (
        <div className="flex flex-col mt-6 flex-shrink-0">
          <div className="flex justify-between items-center px-4 py-1">
            <h3 className="text-base font-black text-zinc-100 flex items-center gap-1.5 leading-none">
              {translations.jobRecommendations}
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </h3>
            <button
              onClick={() => onNavChange('search')}
              className="text-xs text-orange-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
          <h3 className="text-base font-black text-zinc-100">{translations.browseNow}</h3>
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
