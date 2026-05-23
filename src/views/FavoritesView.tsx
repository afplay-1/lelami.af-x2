import React from 'react';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { Listing } from '../types';
import ListingCard from '../components/ListingCard';
import EmptyState from '../components/EmptyState';

interface FavoritesViewProps {
  lang: 'en' | 'da' | 'pa';
  listings: Listing[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onListingSelect: (id: string) => void;
  translations: any;
  onBack?: () => void;
}

export default function FavoritesView({
  lang,
  listings,
  favorites,
  onToggleFavorite,
  onListingSelect,
  translations,
  onBack,
}: FavoritesViewProps) {
  const favoriteListings = listings.filter((l) => favorites.includes(l.id));
  const isRTL = lang === 'da' || lang === 'pa';

  return (
    <div className="flex flex-col flex-grow pb-28 text-zinc-100 select-none px-4 pt-14 animate-fade-in gap-4">
      {/* Title with optional back button */}
      <div className="flex items-center gap-3" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          >
            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
        )}
        <div className="text-left w-full">
          <h2 className="text-2xl font-black text-orange-500 tracking-tight">{translations.favoriteAds}</h2>
          <p className="text-xs text-zinc-400 mt-1 font-semibold">
            {favoriteListings.length} {lang === 'en' ? 'SAVED LISTINGS' : lang === 'da' ? 'آگهی ذخیره شده' : 'خوندي شوي اعلانونه'}
          </p>
        </div>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid grid-cols-2 gap-3.5 mt-2">
          {favoriteListings.map((listing) => (
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
        <div className="mt-8">
          <EmptyState
            icon={<Heart className="w-6 h-6 text-red-500 fill-red-500/20" />}
            title={translations.emptyFavSub}
            subtitle={lang === 'en' ? 'Navigate listings and click ❤️ icon to bookmark items easily!' : 'آگهی‌های دلخواه تان را نشانی کنید تا به راحتی در این بخش به آنها دسترسی داشته باشید.'}
          />
        </div>
      )}
    </div>
  );
}
