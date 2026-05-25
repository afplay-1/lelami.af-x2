import React from 'react';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Listing } from '../types';
import VerifiedBadge from './VerifiedBadge';
import { formatLocalCurrency, translateDate, translateLocation, toLocalNumbers } from '../lib/i18n';

interface ListingCardProps {
  key?: string;
  listing: Listing;
  lang: 'en' | 'da' | 'pa';
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export default function ListingCard({
  listing,
  lang,
  isFavorite,
  onToggleFavorite,
  onClick,
}: ListingCardProps) {
  // Get locale titles and locations
  const getTitle = () => {
    if (lang === 'da' && listing.titleDari) return toLocalNumbers(listing.titleDari, lang);
    if (lang === 'pa' && listing.titlePashto) return toLocalNumbers(listing.titlePashto, lang);
    return toLocalNumbers(listing.title, lang);
  };

  const getLocation = () => {
    const rawLoc = (lang === 'da' && listing.locationDari) 
      ? listing.locationDari 
      : (lang === 'pa' && listing.locationPashto) 
        ? listing.locationPashto 
        : listing.location;
    return translateLocation(rawLoc, lang);
  };

  const getPriceLabel = () => {
    const formattedPrice = formatLocalCurrency(listing.price, lang, listing.currency);
    if (listing.priceType === 'per_month') {
      return `${formattedPrice} ${lang === 'en' ? '/ mo' : lang === 'da' ? '/ ماهانه' : '/ میاشتنی'}`;
    }
    return formattedPrice;
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white border border-zinc-200/90 rounded-[24px] overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer select-none"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={getTitle()}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Favorite circle btn */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 active:scale-90 transition-all cursor-pointer z-10"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`}
          />
        </button>

        {/* Verified Overlay Badge */}
        {listing.isVerified && (
          <div className="absolute bottom-3 left-3 z-10">
            <VerifiedBadge size="sm" />
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-grow p-3.5 bg-white">
        <h4 className="text-zinc-850 font-bold text-sm tracking-tight leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-200">
          {getTitle()}
        </h4>

        {/* Prices and stats */}
        <div className="mt-2.5 flex flex-col gap-0.5">
          <span className="text-blue-600 text-base font-extrabold tracking-tight">
            {getPriceLabel()}
          </span>
          {listing.priceType === 'negotiable' && (
            <span className="text-[10px] text-zinc-500 font-medium font-semibold">
              {lang === 'en' ? 'Negotiable' : lang === 'da' ? 'جورآمد دارد' : 'جوړ جاړی شته'}
            </span>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-semibold select-none">
          <span className="flex items-center gap-1 max-w-[65%] truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="truncate">{getLocation()}</span>
          </span>
          <span className="flex items-center gap-1 flex-shrink-0 text-zinc-400">
            <Clock className="w-3   h-3" />
            <span>{translateDate(listing.postedTime, lang)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
