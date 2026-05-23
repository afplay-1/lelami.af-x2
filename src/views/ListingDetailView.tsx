import React, { useState } from 'react';
import { ChevronLeft, Share2, Heart, ShieldAlert, Eye, MapPin, Clock, Award, ChevronRight } from 'lucide-react';
import { Listing } from '../types';
import ImageCarousel from '../components/ImageCarousel';
import WhatsAppButton from '../components/WhatsAppButton';
import ProfileHeader from '../components/ProfileHeader';

interface ListingDetailViewProps {
  listing: Listing;
  lang: 'en' | 'da' | 'pa';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onListingSelect: (id: string) => void;
  relatedListings: Listing[];
  translations: any;
}

export default function ListingDetailView({
  listing,
  lang,
  isFavorite,
  onToggleFavorite,
  onBack,
  onListingSelect,
  relatedListings,
  translations,
}: ListingDetailViewProps) {
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const getTitle = () => {
    if (lang === 'da' && listing.titleDari) return listing.titleDari;
    if (lang === 'pa' && listing.titlePashto) return listing.titlePashto;
    return listing.title;
  };

  const getDescription = () => {
    if (lang === 'da' && listing.descriptionDari) return listing.descriptionDari;
    if (lang === 'pa' && listing.descriptionPashto) return listing.descriptionPashto;
    return listing.description;
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
    .replace('AFN', 'AFN ');

  const handleShare = () => {
    // Copy fake link to clipboard
    navigator.clipboard.writeText(`https://lelami.af/listing/${listing.id}`);
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 2500);
  };

  const handleReport = (reason: string) => {
    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
    }, 2000);
  };

  const isRTL = lang === 'da' || lang === 'pa';

  return (
    <div className="flex flex-col flex-grow pb-32 text-zinc-100 select-none animate-fade-in relative">
      {/* Absolute top controls */}
      <div className="absolute top-14 left-0 right-0 px-4 z-40 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-neutral-700/30 flex items-center justify-center text-white cursor-pointer active:scale-90 hover:bg-black/80 transition-all"
        >
          <ChevronLeft className={`w-6 h-6 stroke-[2.5] ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-neutral-700/30 flex items-center justify-center text-white cursor-pointer active:scale-90 hover:bg-black/80 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-neutral-700/30 flex items-center justify-center text-white cursor-pointer active:scale-90 hover:bg-black/80 transition-all"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Slide Image Gallery */}
      <div className="w-full flex-shrink-0">
        <ImageCarousel images={listing.images} alt={getTitle()} />
      </div>

      {/* Content wrapper */}
      <div className="p-4 flex flex-col gap-4">
        {/* Title, Views, Time info */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-50 leading-snug">
            {getTitle()}
          </h1>

          <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1 select-none">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{getLocation()}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{listing.postedTime}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
              <Eye className="w-3.5 h-3.5" />
              <span>{listing.views} {lang === 'en' ? 'views' : lang === 'da' ? 'بازدید' : 'لیتنې'}</span>
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-500 tracking-tight font-mono">
              {formattedPrice}
            </span>

            {listing.condition && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/50 text-xs font-semibold text-zinc-300 capitalize">
                {listing.condition === 'like_new'
                  ? lang === 'en'
                    ? 'Like New'
                    : lang === 'da'
                      ? 'در حد نو'
                      : 'نوي غوندې'
                  : lang === 'en'
                    ? 'Used'
                    : lang === 'da'
                      ? 'کارکرده'
                      : 'کارول شوی'}
              </span>
            )}
          </div>
        </div>

        {/* Custom Specifications if they exist */}
        {listing.specs && Object.keys(listing.specs).length > 0 && (
          <div className="bg-white/5 p-4 rounded-[24px] border border-white/10 backdrop-blur-md">
            <h3 className="text-xs text-zinc-400 font-extrabold uppercase tracking-wider mb-2.5">
              {lang === 'en' ? 'SPECIFICATIONS' : lang === 'da' ? 'مشخصات آگهی' : 'تفصيلات او تخنیکي معلومات'}
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              {Object.entries(listing.specs).map(([key, val]) => (
                <div key={key} className="flex flex-col border-l border-zinc-800 pl-2.5 gap-0.5">
                  <span className="text-[10px] text-zinc-550 font-bold uppercase">{key}</span>
                  <span className="text-xs font-mono font-black text-zinc-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs text-zinc-400 font-extrabold uppercase tracking-wider">
            {lang === 'en' ? 'DESCRIPTION' : lang === 'da' ? 'توضیحات آگهی' : 'د اعلان تفصیل'}
          </h3>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {getDescription()}
          </p>
        </div>

        {/* WhatsApp + Direct telephone contacts module */}
        <div className="mt-2.5">
          <WhatsAppButton
            phoneNumber={listing.seller.phone}
            sellerName={listing.seller.name}
            listingTitle={listing.title}
            listingPrice={formattedPrice}
            lang={lang}
          />
        </div>

        {/* Seller Info Container */}
        <div className="mt-3">
          <h3 className="text-xs text-zinc-400 font-extrabold uppercase tracking-wider mb-3">
            {translations.sellerProfile}
          </h3>
          <ProfileHeader user={listing.seller} lang={lang} />
        </div>

        {/* Safety tips awareness segment */}
        <div className="bg-orange-500/5 backdrop-blur-md p-4 rounded-[24px] border border-orange-500/15 flex flex-col gap-2.5">
          <span className="flex items-center gap-2 text-orange-400 text-xs font-black">
            <Award className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{translations.safetyTitle}</span>
          </span>
          <ul className="list-disc pl-5 text-xs text-zinc-450 flex flex-col gap-1.5 leading-relaxed">
            <li>{translations.safetyTip1}</li>
            <li>{translations.safetyTip2}</li>
            <li>{translations.safetyTip3}</li>
          </ul>
        </div>

        {/* Flag reporting area */}
        <button
          onClick={() => setShowReportModal(true)}
          className="mt-2 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-97 text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{translations.reportListing}</span>
        </button>

        {/* Related lists */}
        {relatedListings.length > 0 && (
          <div className="flex flex-col mt-6">
            <h3 className="text-base font-black text-zinc-100 flex items-center gap-1.5 mb-3.5">
              {translations.relatedListings}
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              {relatedListings.map((rel) => {
                const relTitle = lang === 'da' && rel.titleDari ? rel.titleDari : lang === 'pa' && rel.titlePashto ? rel.titlePashto : rel.title;
                return (
                  <div
                    key={rel.id}
                    onClick={() => onListingSelect(rel.id)}
                    className="bg-white/5 rounded-[24px] overflow-hidden border border-white/10 hover:border-orange-500/30 cursor-pointer active:scale-97 transition-all flex flex-col pb-3 backdrop-blur-md"
                  >
                    <div className="aspect-[4/3] bg-zinc-800">
                      <img
                        src={rel.images[0]}
                        alt={relTitle}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2 flex-grow flex flex-col justify-between">
                      <span className="text-zinc-200 font-bold text-xs line-clamp-2 leading-snug">
                        {relTitle}
                      </span>
                      <span className="text-orange-500 font-black font-mono text-xs mt-2.5">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'AFN',
                          maximumFractionDigits: 0,
                        })
                          .format(rel.price)
                          .replace('AFN', 'AFN ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Share Toast Notification Component */}
      {showShareNotification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-orange-500 text-black font-extrabold text-xs px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <span>✔️</span>
          <span>{lang === 'en' ? 'Link copied to clipboard!' : lang === 'da' ? 'لینک کاپی شد!' : 'لینک کاپي شو!'}</span>
        </div>
      )}

      {/* Flag / Report Modal Form overlay */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-black/60 backdrop-blur-lg border border-white/10 rounded-[24px] p-5 shadow-2xl animate-scale-up">
            {!reportSuccess ? (
              <>
                <h3 className="text-zinc-100 font-extrabold text-base mb-3 leading-snug">
                  {lang === 'en' ? 'Why are you reporting this?' : 'چرا گزارش تخلف می‌دهید؟'}
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    lang === 'en' ? 'Spam or Duplicate' : 'اسپم یا تکراری',
                    lang === 'en' ? 'Fraud / Scammer' : 'تقلب / کلاهبرداری',
                    lang === 'en' ? 'Illegal item' : 'غیر قانونی یا ممنوع',
                    lang === 'en' ? 'Wrong price categorization' : 'دسته بندی یا رنج اشتباه',
                  ].map((act, index) => (
                    <button
                      key={index}
                      onClick={() => handleReport(act)}
                      className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs text-left cursor-pointer border border-white/5 transition-colors"
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      {act}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-full mt-3 py-2.5 text-xs font-extrabold text-zinc-500 hover:text-white cursor-pointer"
                  >
                    {lang === 'en' ? 'Cancel' : 'لغو'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <span className="text-3xl mb-2">🛡️</span>
                <h4 className="text-emerald-400 font-extrabold text-sm">
                  {lang === 'en' ? 'Report Submitted' : 'شکایت ثبت شد'}
                </h4>
                <p className="text-xs text-zinc-450 mt-1 leading-normal">
                  {lang === 'en'
                    ? 'Thank you. Our moderation desk will inspect this ad immediately.'
                    : 'تشکر. مدیران سیستم بلافاصله موضوع را پیگیری خواهند کرد.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
