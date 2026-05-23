import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, SlidersHorizontal, MapPin, Grid, Sliders, Calendar, ArrowUpDown, RefreshCw } from 'lucide-react';
import { Listing, Province, CategoryID } from '../types';
import ListingCard from '../components/ListingCard';
import ProvinceSelector from '../components/ProvinceSelector';
import PriceRangeSlider from '../components/PriceRangeSlider';
import EmptyState from '../components/EmptyState';

interface SearchViewProps {
  lang: 'en' | 'da' | 'pa';
  listings: Listing[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onListingSelect: (id: string) => void;
  translations: any;
}

// Helper to determine age offset in hours for sorting by Date
const getHoursOffset = (postedTime: string): number => {
  const timeStr = postedTime.toLowerCase();
  if (timeStr.includes('hour') || timeStr.includes('ساعت') || timeStr.includes('ساعتونه')) {
    const match = timeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  }
  if (timeStr.includes('today') || timeStr.includes('امروز') || timeStr.includes('نن')) {
    return 12;
  }
  if (timeStr.includes('yesterday') || timeStr.includes('دیروز') || timeStr.includes('پرون')) {
    return 24;
  }
  if (timeStr.includes('day') || timeStr.includes('روز') || timeStr.includes('ورځ')) {
    const match = timeStr.match(/\d+/);
    const days = match ? parseInt(match[0]) : 1;
    return days * 24;
  }
  return 1000;
};

// Helper to calculate relevance match scores based on a search term
const getRelevanceScore = (item: Listing, q: string): number => {
  if (q.trim() === '') return 0;
  const lowerQ = q.toLowerCase();
  let score = 0;

  // Title exactly starts with query
  if (
    item.title.toLowerCase().startsWith(lowerQ) ||
    item.titleDari?.toLowerCase().startsWith(lowerQ) ||
    item.titlePashto?.toLowerCase().startsWith(lowerQ)
  ) {
    score += 15;
  }

  // Exact word matches in title & location & description
  const words = lowerQ.split(/\s+/);
  words.forEach((word) => {
    if (word.length < 2) return;
    if (item.title.toLowerCase().includes(word)) score += 10;
    if (item.titleDari?.toLowerCase().includes(word)) score += 10;
    if (item.titlePashto?.toLowerCase().includes(word)) score += 10;
    if (
      item.location.toLowerCase().includes(word) ||
      item.locationDari?.toLowerCase().includes(word) ||
      item.locationPashto?.toLowerCase().includes(word)
    ) {
      score += 5;
    }
    if (
      item.description.toLowerCase().includes(word) ||
      item.descriptionDari?.toLowerCase().includes(word) ||
      item.descriptionPashto?.toLowerCase().includes(word)
    ) {
      score += 2;
    }
  });

  return score;
};

export default function SearchView({
  lang,
  listings,
  favorites,
  onToggleFavorite,
  onListingSelect,
  translations,
}: SearchViewProps) {
  const [query, setQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<Province | ''>('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryID[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'priceAsc' | 'priceDesc'>('relevance');

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Toyota Corolla',
    'iPhone 15',
    'Apartment Shahr-e Naw',
    'MacBook M1',
    'Karakul sheep',
  ]);

  const handleRecentClick = (searchStr: string) => {
    setQuery(searchStr);
  };

  const clearSearch = () => {
    setQuery('');
  };

  const toggleCategory = (catId: CategoryID | 'all') => {
    if (catId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(catId as CategoryID)
          ? prev.filter((id) => id !== catId)
          : [...prev, catId as CategoryID]
      );
    }
  };

  // Safe category definitions for search UI
  const searchCategories: { id: CategoryID | 'all'; label: string }[] = [
    { id: 'all', label: translations.all },
    { id: 'market', label: translations.marketplace },
    { id: 'realestate', label: translations.realestate },
    { id: 'cars', label: translations.cars },
    { id: 'jobs', label: translations.jobs },
    { id: 'phones', label: translations.phones },
    { id: 'livestock', label: translations.livestock },
    { id: 'services', label: translations.services },
  ];

  // Perform filtration based on Query + Province + Multi-select Category + Price range sliders
  const filteredListings = listings.filter((item) => {
    // 1. Text Query matches English, Dari, or Pashto title or location or description
    const textTarget = `${item.title} ${item.titleDari || ''} ${item.titlePashto || ''} ${item.location} ${item.locationDari || ''} ${item.locationPashto || ''} ${item.description} ${item.descriptionDari || ''} ${item.descriptionPashto || ''}`.toLowerCase();
    const queryMatch = query.trim() === '' || textTarget.includes(query.toLowerCase());

    // 2. Province Filter Matches
    const provinceMatch = selectedProvince === '' || item.province === selectedProvince;

    // 3. Multi-select Category Filter Matches (matches any in the list of selected, or matches all if empty)
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);

    // 4. Price Boundaries
    const price = item.price;
    const minMatch = price >= minPrice;
    const maxMatch = price <= maxPrice;

    return queryMatch && provinceMatch && categoryMatch && minMatch && maxMatch;
  });

  // Sort results
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'relevance') {
      if (query.trim() === '') {
        // Fallback to Newest if no query is typed
        return getHoursOffset(a.postedTime) - getHoursOffset(b.postedTime);
      }
      return getRelevanceScore(b, query) - getRelevanceScore(a, query);
    }
    if (sortBy === 'date') {
      return getHoursOffset(a.postedTime) - getHoursOffset(b.postedTime);
    }
    if (sortBy === 'priceAsc') {
      return a.price - b.price;
    }
    if (sortBy === 'priceDesc') {
      return b.price - a.price;
    }
    return 0;
  });

  const isRTL = lang === 'da' || lang === 'pa';
  const isFilterActive =
    selectedProvince !== '' ||
    selectedCategories.length > 0 ||
    minPrice > 0 ||
    maxPrice < 1000000 ||
    sortBy !== 'relevance';

  const handleResetAll = () => {
    setSelectedProvince('');
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(1000000);
    setSortBy('relevance');
  };

  return (
    <div className="flex flex-col flex-grow pb-28 text-white select-none">
      {/* Search Header and Bar */}
      <div className="sticky top-0 bg-black/40 backdrop-blur-md pt-14 pb-3 px-4 z-40 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl px-3.5 py-3 transition-colors duration-200">
            <Search className="w-4 h-4 text-zinc-450 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="flex-grow bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-500 outline-none w-full font-bold"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
            {query.trim() !== '' && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-300 relative cursor-pointer ${
              showFilters || isFilterActive
                ? 'bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/25'
                : 'bg-white/5 border border-white/10 text-zinc-300 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4.5 h-4.5 animate-pulse-subtle" />
            {isFilterActive && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-black text-white">
                !
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Filter Section */}
        {showFilters && (
          <div className="mt-4 p-4 rounded-[24px] bg-black/55 border border-white/10 flex flex-col gap-4 shadow-2xl backdrop-blur-md">
            {/* Sort Results Row */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-start">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 text-left" />
                <span>{translations.sortBy}</span>
              </span>
              <div className="grid grid-cols-4 gap-1.5" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                {[
                  { id: 'relevance', label: translations.sortRelevance },
                  { id: 'date', label: translations.sortNewest },
                  { id: 'priceAsc', label: lang === 'en' ? 'AFN Low' : lang === 'da' ? 'ارزان‌ترین' : 'ارزانه' },
                  { id: 'priceDesc', label: lang === 'en' ? 'AFN High' : lang === 'da' ? 'گران‌ترین' : 'قیمتي' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id as any)}
                    className={`px-1 py-2 rounded-xl text-[10px] font-black transition-all text-center cursor-pointer border truncate ${
                      sortBy === opt.id
                        ? 'bg-orange-500 text-black border-orange-500 font-extrabold shadow-sm'
                        : 'bg-white/5 text-zinc-300 hover:text-white border-white/5 hover:border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Province Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-start">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 text-left" />
                <span>{translations.provincesLabel}</span>
              </span>
              <ProvinceSelector selectedProvince={selectedProvince} onChange={setSelectedProvince} lang={lang} />
            </div>

            {/* Multi-select Category Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide flex items-center justify-between">
                <span>{translations.categoriesLabel}</span>
                <span className="text-[9px] text-zinc-550 font-normal normal-case">
                  ({translations.categoryMultiSelectHint})
                </span>
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                {searchCategories.map((cat) => {
                  const isActive =
                    cat.id === 'all'
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(cat.id);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap cursor-pointer border ${
                        isActive
                          ? 'bg-orange-500 text-black border-orange-500 font-black shadow-sm'
                          : 'bg-white/5 text-zinc-300 hover:text-white border-white/5 hover:border-white/10'
                      }`}
                    >
                      {cat.label}
                      {cat.id !== 'all' && selectedCategories.includes(cat.id) && (
                        <span className="ml-1 text-[9px] font-extrabold text-black/90">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Boundaries - Brand New Slider */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-start">
                <Sliders className="w-3.5 h-3.5 text-zinc-500 text-left" />
                <span>{translations.priceRange}</span>
              </span>
              <PriceRangeSlider
                minVal={minPrice}
                maxVal={maxPrice}
                minLimit={0}
                maxLimit={1000000}
                step={5000}
                onChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                lang={lang}
              />
            </div>

            {/* Reset All Filters Action */}
            {isFilterActive && (
              <button
                onClick={handleResetAll}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-center text-xs font-black text-orange-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{translations.resetFilters}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recents Searches Overlay - shown if search box has no inputs */}
      {query.trim() === '' && (
        <div className="flex flex-col px-4 pt-4 flex-shrink-0 animate-fade-in mb-2">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2.5 select-none text-left">
            {translations.recentSearches}
          </span>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((rec, idx) => (
              <div
                key={idx}
                onClick={() => handleRecentClick(rec)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[11px] font-bold bg-white/5 hover:bg-white/10 text-white/70 hover:text-orange-400 cursor-pointer transition-colors border border-white/5"
              >
                <span className="text-zinc-650 text-[10px]">🔍</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Search Result block (shown always by default, updating instantly upon interactions) */}
      <div className="flex flex-col mt-4 px-4 flex-grow">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs text-zinc-400 font-bold" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {query.trim() !== '' ? (
              <span>
                {sortedListings.length} {translations.resultsFor} "{query}"
              </span>
            ) : (
              <span>
                {sortedListings.length}{' '}
                {lang === 'en' ? 'MATCHING ADS' : lang === 'da' ? 'آگهی منطبق' : 'موندل شوي اعلانونه'}
              </span>
            )}
          </span>

          {/* Active sorting indicator */}
          <span className="text-[10px] text-zinc-500 font-mono font-bold flex items-center gap-1">
            <span>{translations.sortBy}:</span>
            <span className="text-orange-400 lowercase font-bold font-sans">
              {sortBy === 'relevance'
                ? translations.sortRelevance
                : sortBy === 'date'
                  ? translations.sortNewest
                  : sortBy === 'priceAsc'
                    ? (lang === 'en' ? 'low to high' : lang === 'da' ? 'ارزان‌ترین' : 'ارزانه')
                    : (lang === 'en' ? 'high to low' : lang === 'da' ? 'گران‌ترین' : 'قیمتي')}
            </span>
          </span>
        </div>

        {sortedListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {sortedListings.map((listing) => (
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
        ) : (
          <div className="mt-8 transition-all p-2 select-none">
            <EmptyState title={translations.noResults} subtitle={translations.emptyFavSub} />
          </div>
        )}
      </div>
    </div>
  );
}
