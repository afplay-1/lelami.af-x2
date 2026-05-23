import React from 'react';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Listing } from '../types';
import VerifiedBadge from './VerifiedBadge';

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
    if (lang === 'da' && listing.titleDari) return listing.titleDari;
    if (lang === 'pa' && listing.titlePashto) return listing.titlePashto;
    return listing.title;
  };

  const getLocation = () => {
    if (lang === 'da' && listing.locationDari) return listing.locationDari;
    if (lang === 'pa' && listing.locationPashto) return listing.locationPashto;
    return listing.location;
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AFN',
    maximumFractionDigits: 0,
  })
    .format(listing.price)
    .replace('AFN', 'AFN '); // Nice spacing

  const getPriceLabel = () => {
    if (listing.priceType === 'per_month') {
      return `${formattedPrice} ${lang === 'en' ? '/ mo' : lang === 'da' ? '/ ماهانه' : '/ میاشتنی'}`;
    }
    return formattedPrice;
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-[24px] overflow-hidden hover:border-orange-500/30 transition-all duration-300 shadow-md hover:shadow-2xl cursor-pointer select-none backdrop-blur-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-zinc-800 overflow-hidden">
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
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-neutral-700/50 hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
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
      <div className="flex flex-col flex-grow p-3.5">
        <h4 className="text-zinc-100 font-bold text-sm tracking-tight leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-orange-400 transition-colors duration-200">
          {getTitle()}
        </h4>

        {/* Prices and stats */}
        <div className="mt-2.5 flex flex-col gap-0.5">
          <span className="text-orange-500 text-base font-extrabold tracking-tight">
            {getPriceLabel()}
          </span>
          {listing.priceType === 'negotiable' && (
            <span className="text-[10px] text-zinc-400 font-medium">
              {lang === 'en' ? 'Negotiable' : lang === 'da' ? 'جورآمد دارد' : 'جوړ جاړی شته'}
            </span>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-auto pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-medium select-none">
          <span className="flex items-center gap-1 max-w-[65%] truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
            <span className="truncate">{getLocation()}</span>
          </span>
          <span className="flex items-center gap-1 flex-shrink-0 text-zinc-500">
            <Clock className="w-3 h-3" />
            <span>{listing.postedTime}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
