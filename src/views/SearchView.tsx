import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, SlidersHorizontal, MapPin, Grid, Sliders, Calendar, ArrowUpDown, RefreshCw } from 'lucide-react';
import { Listing, Province, CategoryID } from '../types';
import ListingCard from '../components/ListingCard';
import ProvinceSelector from '../components/ProvinceSelector';
import PriceRangeSlider from '../components/PriceRangeSlider';
import EmptyState from '../components/EmptyState';
import { toLocalNumbers, translateLocation } from '../lib/i18n';
import { CATEGORIES, getMatchedCategoriesByQuery } from '../data/categories';

interface SearchViewProps {
  lang: 'en' | 'da' | 'pa';
  listings: Listing[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onListingSelect: (id: string) => void;
  translations: any;
}

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

const getRelevanceScore = (item: Listing, q: string): number => {
  if (q.trim() === '') return 0;
  const lowerQ = q.toLowerCase();
  let score = 0;

  if (
    item.title.toLowerCase().startsWith(lowerQ) ||
    item.titleDari?.toLowerCase().startsWith(lowerQ) ||
    item.titlePashto?.toLowerCase().startsWith(lowerQ)
  ) {
    score += 15;
  }

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
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedHandDrive, setSelectedHandDrive] = useState<'left' | 'right' | 'ashtari' | ''>('');
  const [selectedCarpetStyle, setSelectedCarpetStyle] = useState<'turkmen' | 'herati' | 'mazar' | 'other' | ''>('');
  const [currencyFilter, setCurrencyFilter] = useState<'ALL' | 'AFN' | 'USD'>('ALL');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'priceAsc' | 'priceDesc'>('relevance');

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lelami_recent_searches');
      return saved ? JSON.parse(saved) : [
        'Toyota Corolla',
        'iPhone 15',
        'Apartment Shahr-e Naw',
        'MacBook M1',
        'Karakul sheep',
      ];
    } catch {
      return [
        'Toyota Corolla',
        'iPhone 15',
        'Apartment Shahr-e Naw',
        'MacBook M1',
        'Karakul sheep',
      ];
    }
  });

  const saveSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      localStorage.setItem('lelami_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRecentDelete = (s: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== s);
      localStorage.setItem('lelami_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRecentClick = (searchStr: string) => {
    setQuery(searchStr);
  };

  const clearSearch = () => {
    setQuery('');
  };

  const toggleCategory = (catId: CategoryID | 'all') => {
    setSelectedSubcategory('');
    setSelectedHandDrive('');
    setSelectedCarpetStyle('');

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

  const searchCategories: { id: CategoryID | 'all'; label: string }[] = [
    { id: 'all', label: translations.all },
    ...CATEGORIES.map((cat) => ({
      id: cat.id as CategoryID,
      label: lang === 'da' ? cat.labelDari : lang === 'pa' ? cat.labelPashto : cat.label,
    })),
  ];

  const filteredListings = listings.filter((item) => {
    // 1. Text Query Matching with Smart Category Mapping
    const matchedFromQuery = getMatchedCategoriesByQuery(query);
    const textTarget = `${item.title} ${item.titleDari || ''} ${item.titlePashto || ''} ${item.location} ${item.locationDari || ''} ${item.locationPashto || ''} ${item.description} ${item.descriptionDari || ''} ${item.descriptionPashto || ''} ${item.category} ${item.subcategory || ''}`.toLowerCase();
    
    let queryMatch = query.trim() === '' || textTarget.includes(query.toLowerCase());
    
    if (!queryMatch && query.trim() !== '') {
      const isCatMatched = matchedFromQuery.includes(item.category);
      if (isCatMatched) {
        queryMatch = true;
      }
    }

    // 2. Province Criteria
    const provinceMatch = selectedProvince === '' || item.province === selectedProvince;

    // 3. Category Criteria
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);

    // 4. Sub-category Criteria
    const subcategoryMatch = selectedSubcategory === '' || item.subcategory === selectedSubcategory;

    // 5. Hand Drive Side Criteria
    const handDriveMatch = selectedHandDrive === '' || item.handDrive === selectedHandDrive;

    // 6. Carpet Style Criteria
    const carpetStyleMatch = selectedCarpetStyle === '' || item.carpetStyle === selectedCarpetStyle;

    // 7. Currency Criteria
    const currencyMatch = currencyFilter === 'ALL' || item.currency === currencyFilter;

    // 8. Price Constraints
    const price = item.price;
    const minMatch = price >= minPrice;
    const maxMatch = price <= maxPrice;

    return queryMatch && provinceMatch && categoryMatch && subcategoryMatch && handDriveMatch && carpetStyleMatch && currencyMatch && minMatch && maxMatch;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'relevance') {
      if (query.trim() === '') {
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
    selectedSubcategory !== '' ||
    selectedHandDrive !== '' ||
    selectedCarpetStyle !== '' ||
    currencyFilter !== 'ALL' ||
    minPrice > 0 ||
    maxPrice < 1000000 ||
    sortBy !== 'relevance';

  const handleResetAll = () => {
    setSelectedProvince('');
    setSelectedCategories([]);
    setSelectedSubcategory('');
    setSelectedHandDrive('');
    setSelectedCarpetStyle('');
    setCurrencyFilter('ALL');
    setMinPrice(0);
    setMaxPrice(1000000);
    setSortBy('relevance');
  };

  return (
    <div className="flex flex-col flex-grow pb-20 text-zinc-800 select-none">
      {/* Search Header and Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md pt-6 pb-2.5 px-4 z-40 border-b border-zinc-200/80 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center bg-zinc-100/95 border border-zinc-200 hover:border-blue-500/30 rounded-2xl px-3.5 py-3 transition-colors duration-200">
            <Search className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveSearch(query);
              }}
              className="flex-grow flex items-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearch(query);
                  }
                }}
                placeholder={translations.searchPlaceholder}
                className="flex-grow bg-transparent border-none text-sm text-zinc-800 placeholder-zinc-400 outline-none w-full font-bold text-left"
                style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}
              />
            </form>
            {query.trim() !== '' && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-650 hover:bg-zinc-200 active:scale-90 cursor-pointer"
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
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-zinc-100 border border-zinc-205 text-zinc-550 hover:border-zinc-300 hover:bg-zinc-200 text-zinc-650'
            }`}
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
            {isFilterActive && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                !
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Filter Section */}
        {showFilters && (
          <div className="mt-4 p-4 rounded-[24px] bg-white border border-zinc-200/90 flex flex-col gap-4 shadow-xl">
            {/* Sort Results Row */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-start">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 text-left" />
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
                        ? 'bg-blue-600 text-white border-blue-600 font-extrabold shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-150 hover:text-zinc-800 hover:bg-zinc-200 hover:border-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Province Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-start">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 text-left" />
                <span>{translations.provincesLabel}</span>
              </span>
              <ProvinceSelector selectedProvince={selectedProvince} onChange={setSelectedProvince} lang={lang} />
            </div>

            {/* Multi-select Category Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide flex items-center justify-between">
                <span>{translations.categoriesLabel}</span>
                <span className="text-[9px] text-zinc-400 font-normal normal-case">
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
                          ? 'bg-blue-600 text-white border-blue-600 font-black shadow-sm'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-150 hover:text-zinc-800 hover:bg-zinc-200 hover:border-zinc-200'
                      }`}
                    >
                      {cat.label}
                      {cat.id !== 'all' && selectedCategories.includes(cat.id) && (
                        <span className="ml-1 text-[9px] font-extrabold text-white">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-category Filter */}
            {selectedCategories.length === 1 && (
              <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                  {lang === 'en' ? 'Sub-category' : lang === 'da' ? 'کتگوری فرعی' : 'کټګوري فرعي'}
                </span>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setSelectedHandDrive('');
                    setSelectedCarpetStyle('');
                  }}
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500/70 cursor-pointer"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                  <option value="">{lang === 'en' ? 'All Sub-categories' : lang === 'da' ? 'همه کټگوری‌های فرعی' : 'ټول فرعي کټګورۍ'}</option>
                  {(CATEGORIES.find((cat) => cat.id === selectedCategories[0])?.subcategories || []).map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {lang === 'da' ? sub.labelDari : lang === 'pa' ? sub.labelPashto : sub.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Steering Side Filter */}
            {selectedCategories.includes('vehicles') && (selectedSubcategory === 'cars' || selectedSubcategory === '') && (
              <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                  {lang === 'en' ? 'Steering Hand Side / Drive' : lang === 'da' ? 'موقعیت فرمان (دست)' : 'د فرمان اړخ (راست یا چپ)'}
                </span>
                <select
                  value={selectedHandDrive}
                  onChange={(e) => setSelectedHandDrive(e.target.value as any)}
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500/70 cursor-pointer"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                  <option value="">{lang === 'en' ? 'Any steer side' : lang === 'da' ? 'هر نوع موقعیت فرمان' : 'هر ډول فرمان'}</option>
                  <option value="left">{lang === 'en' ? 'Left-Hand Drive (LHD)' : lang === 'da' ? 'فرمان چپ (دست چپ)' : 'چپ فرمان / دست چپ'}</option>
                  <option value="right">{lang === 'en' ? 'Right-Hand Drive (RHD)' : lang === 'da' ? 'فرمان راست (دست راست / ویش)' : 'راست فرمان / دست راست'}</option>
                  <option value="ashtari">{lang === 'en' ? 'Ashtari (Converted / اشترنگ)' : lang === 'da' ? 'اشتری (تبدیل شده)' : 'اشتری کاندید شوی'}</option>
                </select>
              </div>
            )}

            {/* Carpet Style Filter */}
            {selectedCategories.includes('home') && (selectedSubcategory === 'carpets' || selectedSubcategory === '') && (
              <div className="flex flex-col gap-1.5 animate-fade-in text-left">
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                  {lang === 'en' ? 'Carpet Regional Style' : lang === 'da' ? 'طرح و منطقه بافت قالین' : 'د غالۍ ډیزاین کټګوري'}
                </span>
                <select
                  value={selectedCarpetStyle}
                  onChange={(e) => setSelectedCarpetStyle(e.target.value as any)}
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-800 outline-none focus:border-blue-500/70 cursor-pointer"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                  <option value="">{lang === 'en' ? 'Any regional style' : lang === 'da' ? 'هر نوع بافت یا طرح' : 'هر ډول ډیزاین'}</option>
                  <option value="turkmen">{lang === 'en' ? 'Turkmen Traditional (قالین ترکمنی)' : lang === 'da' ? 'طرح ترکمنی (سرخ)' : 'ترکمني سره غالۍ'}</option>
                  <option value="herati">{lang === 'en' ? 'Herati Style / Mauri (قالین هراتی)' : lang === 'da' ? 'طرح هراتی / موری' : 'هراتي موري غالۍ'}</option>
                  <option value="mazar">{lang === 'en' ? 'Mazar Style / Chob Rang (مزار)' : lang === 'da' ? 'طرح مزار شریف / چوب رنگ' : 'مزار چوب رنګ غالۍ'}</option>
                  <option value="other">{lang === 'en' ? 'Other Handcrafted Afghan Art' : lang === 'da' ? 'دیگر صنایع دستی بافت کشور' : 'نور لاسي لست'}</option>
                </select>
              </div>
            )}

            {/* Currency Filter */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide">
                {lang === 'en' ? 'Preferred Currency' : lang === 'da' ? 'ارز مورد نظر' : 'مطلوبه اسعار'}
              </span>
              <div className="flex bg-zinc-100 p-0.5 rounded-xl border border-zinc-200 shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => setCurrencyFilter('ALL')}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    currencyFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-805'
                  }`}
                >
                  {lang === 'en' ? 'ALL' : lang === 'da' ? 'همه' : 'ټول'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyFilter('AFN')}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    currencyFilter === 'AFN'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-805'
                  }`}
                >
                  AFN
                </button>
                <button
                  type="button"
                  onClick={() => setCurrencyFilter('USD')}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    currencyFilter === 'USD'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-805'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>

            {/* Price Filter Boundaries */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-start">
                <Sliders className="w-3.5 h-3.5 text-zinc-400 text-left" />
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
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-center text-xs font-black text-blue-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{translations.resetFilters}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recents Searches Overlay */}
      {query.trim() === '' && (
        <div className="flex flex-col px-4 pt-4 flex-shrink-0 animate-fade-in mb-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2.5 select-none text-left">
            {translations.recentSearches}
          </span>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((rec, idx) => (
              <div
                key={idx}
                onClick={() => handleRecentClick(rec)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[11px] font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-blue-600 cursor-pointer transition-all border border-zinc-200 select-none shadow-sm"
              >
                <span className="text-zinc-600 text-[10px]">🔍</span>
                <span>{rec}</span>
                <button
                  onClick={(e) => handleRecentDelete(rec, e)}
                  className="w-4 h-4 ml-1 rounded-full text-[9px] font-black hover:bg-zinc-250 hover:text-red-500 text-zinc-400 transition-colors flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Search Result block */}
      <div className="flex flex-col mt-4 px-4 flex-grow">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs text-zinc-500 font-bold" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {query.trim() !== '' ? (
              <span>
                {toLocalNumbers(String(sortedListings.length), lang)} {translations.resultsFor} "{toLocalNumbers(query, lang)}"
              </span>
            ) : (
              <span>
                {toLocalNumbers(String(sortedListings.length), lang)}{' '}
                {lang === 'en' ? 'MATCHING ADS' : lang === 'da' ? 'آگهی منطبق' : 'موندل شوي اعلانونه'}
              </span>
            )}
          </span>

          {/* Active sorting indicator */}
          <span className="text-[10px] text-zinc-550 font-mono font-bold flex items-center gap-1 text-zinc-400">
            <span>{translations.sortBy}:</span>
            <span className="text-blue-600 lowercase font-bold font-sans">
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
          <div className="mt-8 transition-all p-2 select-none text-zinc-500">
            <EmptyState title={translations.noResults} subtitle={translations.emptyFavSub} />
          </div>
        )}
      </div>
    </div>
  );
}
