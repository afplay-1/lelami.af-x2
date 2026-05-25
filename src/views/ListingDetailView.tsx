import React, { useState } from 'react';
import { ChevronLeft, Share2, Heart, ShieldAlert, Eye, MapPin, Clock, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Listing, User } from '../types';
import { updateFirestoreListing } from '../lib/firebaseService';
import { CATEGORIES } from '../data/categories';
import ImageCarousel from '../components/ImageCarousel';
import WhatsAppButton from '../components/WhatsAppButton';
import ProfileHeader from '../components/ProfileHeader';
import { formatLocalCurrency, translateDate, translateLocation, toLocalNumbers } from '../lib/i18n';

interface ListingDetailViewProps {
  listing: Listing;
  lang: 'en' | 'da' | 'pa';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onListingSelect: (id: string) => void;
  relatedListings: Listing[];
  translations: any;
  onStartChat: (
    sellerName: string,
    sellerAvatar: string,
    listingTitle: string,
    listingPrice: string,
    listingImage: string
  ) => void;
  currentUser: User | null;
  onUpdateListing: (listing: Listing) => void;
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
  onStartChat,
  currentUser,
  onUpdateListing,
}: ListingDetailViewProps) {
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const getTitle = () => {
    let rawTitle = listing.title;
    if (lang === 'da' && listing.titleDari) rawTitle = listing.titleDari;
    if (lang === 'pa' && listing.titlePashto) rawTitle = listing.titlePashto;
    return toLocalNumbers(rawTitle, lang);
  };

  const getDescription = () => {
    let rawDesc = listing.description;
    if (lang === 'da' && listing.descriptionDari) rawDesc = listing.descriptionDari;
    if (lang === 'pa' && listing.descriptionPashto) rawDesc = listing.descriptionPashto;
    return toLocalNumbers(rawDesc, lang);
  };

  const getLocation = () => {
    let rawLoc = listing.location;
    if (lang === 'da' && listing.locationDari) rawLoc = listing.locationDari;
    if (lang === 'pa' && listing.locationPashto) rawLoc = listing.locationPashto;
    return translateLocation(rawLoc, lang);
  };

  const formattedPrice = formatLocalCurrency(listing.price, lang, listing.currency);

  const handleShare = () => {
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
    <div className="flex flex-col flex-grow pb-24 text-zinc-800 select-none animate-fade-in relative">
      {/* Absolute top controls */}
      <div className="absolute top-6 left-0 right-0 px-4 z-40 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 flex items-center justify-center text-zinc-700 cursor-pointer active:scale-90 hover:bg-white transition-all shadow-sm"
        >
          <ChevronLeft className={`w-6 h-6 stroke-[2.5] ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 flex items-center justify-center text-zinc-700 cursor-pointer active:scale-90 hover:bg-white transition-all shadow-sm"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 flex items-center justify-center text-zinc-750 cursor-pointer active:scale-90 hover:bg-white transition-all shadow-sm"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-500'}`} />
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
          <h1 className="text-xl font-black font-sans tracking-tight text-zinc-900 leading-snug">
            {getTitle()}
          </h1>

          <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1 select-none">
            <span className="flex items-center gap-1 text-blue-600 font-extrabold">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{getLocation()}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{translateDate(listing.postedTime, lang)}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-semibold">
              <Eye className="w-3.5 h-3.5" />
              <span>{toLocalNumbers(listing.views, lang)} {lang === 'en' ? 'views' : lang === 'da' ? 'بازدید' : 'لیتنې'}</span>
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-blue-600 tracking-tight">
                {formattedPrice}
              </span>
              {listing.isSold && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wide uppercase animate-pulse">
                    {lang === 'en' ? 'SOLD' : lang === 'da' ? 'فروخته شد' : 'پلورل شوی'}
                  </span>
                )}
            </div>

            {listing.condition && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-650 capitalize">
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

        {/* Mark as Sold dynamic action for listing owners */}
        {currentUser && currentUser.id === listing.seller.id && !listing.isSold && (
          <button
            onClick={async () => {
              try {
                await updateFirestoreListing(listing.id, { isSold: true });
                onUpdateListing({ ...listing, isSold: true });
              } catch (err) {
                console.error('Failed to mark listing as sold:', err);
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-97 text-center text-xs font-black text-white tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>
              {lang === 'en'
                ? 'Mark as Sold'
                : lang === 'da'
                  ? 'ثبت به عنوان فروخته‌شده'
                  : 'د پلورل شوي په توګه ثبتول'}
            </span>
          </button>
        )}

        {/* Unified Specifications if they exist */}
        {(() => {
          const specItems: { label: string; value: string }[] = [];

          // 1. Resolve subcategory label
          if (listing.subcategory) {
            const cat = CATEGORIES.find((c) => c.id === listing.category);
            const sub = cat?.subcategories.find((s) => s.id === listing.subcategory);
            if (sub) {
              const subLabel = lang === 'da' ? sub.labelDari : lang === 'pa' ? sub.labelPashto : sub.label;
              specItems.push({
                label: lang === 'en' ? 'Subcategory' : lang === 'da' ? 'کتگوری فرعی' : 'مسلکي کټګوري',
                value: subLabel,
              });
            }
          }

          // 2. Resolve steering position
          if (listing.handDrive) {
            let labelHd = '';
            if (listing.handDrive === 'left') {
              labelHd = lang === 'en' ? 'Left-Hand (LHD)' : lang === 'da' ? 'فرمان چپ' : 'چپ فرمان';
            } else if (listing.handDrive === 'right') {
              labelHd = lang === 'en' ? 'Right-Hand (RHD)' : lang === 'da' ? 'فرمان راست / دست راست' : 'راست فرمان / دست راست';
            } else if (listing.handDrive === 'ashtari') {
              labelHd = lang === 'en' ? 'Ashtari (Converted)' : lang === 'da' ? 'اشتری (تبدیل شده)' : 'اشتری کاندید شوی';
            }
            if (labelHd) {
              specItems.push({
                label: lang === 'en' ? 'Steering Hand' : lang === 'da' ? 'موقعیت فرمان' : 'د فرمان اړخ',
                value: labelHd,
              });
            }
          }

          // 3. Resolve carpet styles
          if (listing.carpetStyle) {
            let labelCs = '';
            if (listing.carpetStyle === 'turkmen') {
              labelCs = lang === 'en' ? 'Turkmen Traditional' : lang === 'da' ? 'طرح ترکمنی (سرخ)' : 'ترکمني سره غالۍ';
            } else if (listing.carpetStyle === 'herati') {
              labelCs = lang === 'en' ? 'Herati / Mauri' : lang === 'da' ? 'طرح هراتی / موری' : 'هراتي موري غالۍ';
            } else if (listing.carpetStyle === 'mazar') {
              labelCs = lang === 'en' ? 'Mazar / Chob Rang' : lang === 'da' ? 'طرح مزار شریف / چوب رنگ' : 'مزار چوب رنګ غالۍ';
            } else if (listing.carpetStyle === 'other') {
              labelCs = lang === 'en' ? 'Handcrafted Afghan Art' : lang === 'da' ? 'صنایع دستی بافت کشور' : 'نور لاسي لست';
            }
            if (labelCs) {
              specItems.push({
                label: lang === 'en' ? 'Carpet Style' : lang === 'da' ? 'طرح و نقش قالین' : 'د غالۍ ډیزاین',
                value: labelCs,
              });
            }
          }

          // 4. Merge manual custom user specs
          if (listing.specs) {
            Object.entries(listing.specs).forEach(([key, val]) => {
              specItems.push({
                label: key,
                value: String(val),
              });
            });
          }

          if (specItems.length === 0) return null;

          return (
            <div className="bg-zinc-50 p-4 rounded-[24px] border border-zinc-200/85">
              <h3 className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider mb-2.5">
                {lang === 'en' ? 'SPECIFICATIONS' : lang === 'da' ? 'مشخصات آگهی' : 'تفصيلات او تخنیکي معلومات'}
              </h3>
              <div className="grid grid-cols-2 gap-3.5">
                {specItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col border-l border-zinc-200 pl-2.5 gap-0.5" style={{ textAlign: isRTL ? 'right' : 'left', borderLeftWidth: isRTL ? '0px' : '1px', borderRightWidth: isRTL ? '1px' : '0px', paddingLeft: isRTL ? '0px' : '10px', paddingRight: isRTL ? '10px' : '0px', borderColor: '#e4e4e7' }}>
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase select-none">{item.label}</span>
                    <span className="text-xs font-sans font-bold text-zinc-805 text-zinc-800">{toLocalNumbers(item.value, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider">
            {lang === 'en' ? 'DESCRIPTION' : lang === 'da' ? 'توضیحات آگهی' : 'د اعلان تفصیل'}
          </h3>
          <p className="text-zinc-750 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {getDescription()}
          </p>
        </div>

        {/* WhatsApp + Direct telephone contacts module */}
        {!listing.isSold ? (
          <div className="mt-2.5">
            <WhatsAppButton
              phoneNumber={listing.seller.phone}
              sellerName={listing.seller.name}
              listingTitle={listing.title}
              listingPrice={formattedPrice}
              lang={lang}
              onMessageClick={() => {
                onStartChat(
                  listing.seller.name,
                  listing.seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
                  listing.title,
                  formattedPrice,
                  listing.images[0] || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=150'
                );
              }}
            />
          </div>
        ) : (
          <div className="mt-2.5 p-4 rounded-[24px] bg-red-100/30 border border-red-200 text-center font-bold text-xs text-red-650 animate-fade-in">
            {lang === 'en'
              ? 'This listing has been marked as sold, and active communication portals have been secured.'
              : lang === 'da'
                ? 'این آگهی به عنوان فروخته‌شده ثبت شده و راه‌های ارتباطی غیرفعال گردیده‌اند.'
                : 'دا اعلان د پلورل شوي په توګه ثبت شوی او د اړیکو چارې بندې شوي دي.'}
          </div>
        )}

        {/* Dynamic Multi-Option Share Row */}
        <div className="flex gap-2.5 mt-0.5 animate-fade-in select-none">
          <button
            onClick={handleShare}
            className="flex-grow py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-97 text-center text-xs font-black text-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 className="w-4 h-4 text-zinc-500" />
            <span>{translations.shareListing || 'Share Ad / Copy Link'}</span>
          </button>
          
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `Check out this ad on Lelami:\n\n${listing.title}\nPrice: ${formattedPrice}\n\nLink: https://lelami.af/listing/${listing.id}`
              );
              window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            }}
            className="flex-grow py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/50 active:scale-97 text-center text-xs font-black text-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.031 2c-5.524 0-10 4.476-10 10 0 1.83.493 3.543 1.348 5.02L2 22l5.127-1.348C8.57 21.43 10.237 21.9 12.031 21.9c5.524 0 10.002-4.476 10.002-10s-4.478-10-10.002-10zm5.176 13.914c-.255.722-1.282 1.321-2.072 1.488-.532.112-1.23.2-3.565-.77-2.983-1.242-4.912-4.282-5.06-4.482-.148-.2-1.208-1.611-1.208-3.073 0-1.463.766-2.183 1.042-2.484.275-.3.601-.375.801-.375.2 0 .4 0 .576.008.183.008.433-.033.682.567.258.625.883 2.15.958 2.3.076.15.126.325.025.525-.1.2-.15.3-.3.475-.15.175-.316.391-.45.525-.15.15-.308.316-.133.616.175.3.776 1.282 1.666 2.072.1.092.192.175.283.25.759.633 1.434.833 1.834.992.3.117.584.058.742-.092c.117-.112.442-.425.567-.575.125-.15.258-.125.433-.058.175.066 1.1.517 1.292.617.192.1.317.15.367.234.05.084.05.492-.205 1.217z"/>
            </svg>
            <span>{lang === 'en' ? 'Share on WhatsApp' : lang === 'da' ? 'ارسال به واتساپ' : 'واټساپ ته لېږل'}</span>
          </button>
        </div>

        {/* Seller Info Container */}
        <div className="mt-3">
          <h3 className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider mb-3">
            {translations.sellerProfile}
          </h3>
          <ProfileHeader user={listing.seller} lang={lang} />
        </div>

        {/* Safety tips awareness segment */}
        <div className="bg-blue-600/5 p-4 rounded-[24px] border border-blue-600/15 flex flex-col gap-2.5">
          <span className="flex items-center gap-2 text-blue-600 text-xs font-black">
            <Award className="w-4 h-4 text-blue-600 animate-bounce" />
            <span>{translations.safetyTitle}</span>
          </span>
          <ul className="list-disc pl-5 text-xs text-zinc-500 flex flex-col gap-1.5 leading-relaxed font-semibold">
            <li>{translations.safetyTip1}</li>
            <li>{translations.safetyTip2}</li>
            <li>{translations.safetyTip3}</li>
          </ul>
        </div>

        {/* Flag reporting area */}
        <button
          onClick={() => setShowReportModal(true)}
          className="mt-2 py-3 px-4 rounded-xl bg-red-500/5 border border-red-200 text-red-600 hover:bg-red-100/30 active:scale-97 text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{translations.reportListing}</span>
        </button>

        {/* Related lists */}
        {relatedListings.length > 0 && (
          <div className="flex flex-col mt-6">
            <h3 className="text-base font-black text-zinc-900 flex items-center gap-1.5 mb-3.5">
              {translations.relatedListings}
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              {relatedListings.slice(0, 4).map((rel) => {
                let relTitle = rel.title;
                if (lang === 'da' && rel.titleDari) relTitle = rel.titleDari;
                if (lang === 'pa' && rel.titlePashto) relTitle = rel.titlePashto;
                relTitle = toLocalNumbers(relTitle, lang);

                return (
                  <div
                    key={rel.id}
                    onClick={() => onListingSelect(rel.id)}
                    className="bg-white rounded-[24px] overflow-hidden border border-zinc-200 hover:border-blue-500/30 cursor-pointer active:scale-97 transition-all flex flex-col pb-3 shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-[4/3] bg-zinc-100">
                      <img
                        src={rel.images[0]}
                        alt={relTitle}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2.5 flex-grow flex flex-col justify-between">
                      <span className="text-zinc-800 font-bold text-xs line-clamp-2 leading-snug">
                        {relTitle}
                      </span>
                      <span className="text-blue-600 font-black text-sm mt-2.5">
                        {formatLocalCurrency(rel.price, lang, rel.currency)}
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-605 text-white bg-blue-600 font-extrabold text-xs px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <span>✔️</span>
          <span>{lang === 'en' ? 'Link copied to clipboard!' : lang === 'da' ? 'لینک کاپی شد!' : 'لینک کاپي شو!'}</span>
        </div>
      )}

      {/* Flag / Report Modal Form overlay */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white border border-zinc-250 rounded-[24px] p-5 shadow-2xl animate-scale-up">
            {!reportSuccess ? (
              <>
                <h3 className="text-zinc-900 font-extrabold text-base mb-3 leading-snug">
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
                      className="w-full p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold text-xs text-left cursor-pointer border border-zinc-100 transition-colors"
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      {act}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-full mt-3 py-2.5 text-xs font-extrabold text-zinc-550 text-zinc-500 hover:text-zinc-800 cursor-pointer text-center"
                  >
                    {lang === 'en' ? 'Cancel' : 'لغو'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <span className="text-3xl mb-2">🛡️</span>
                <h4 className="text-emerald-500 font-extrabold text-sm">
                  {lang === 'en' ? 'Report Submitted' : 'شکایت ثبت شد'}
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-normal font-semibold">
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
