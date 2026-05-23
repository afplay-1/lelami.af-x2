import React, { useState } from 'react';
import { Phone, Eye, MessageCircle, Heart } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  sellerName: string;
  listingTitle: string;
  listingPrice: string;
  lang: 'en' | 'da' | 'pa';
}

export default function WhatsAppButton({
  phoneNumber,
  sellerName,
  listingTitle,
  listingPrice,
  lang,
}: WhatsAppButtonProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Mask number for safety and call-to-reveal engagement
  const maskedPhone = phoneNumber.substring(0, 6) + ' ••• ••••';

  // Construct standard deep-linking for WhatsApp
  const handleWhatsAppClick = () => {
    const textMessage =
      lang === 'en'
        ? `Salam ${sellerName}, I am interested in your listing "${listingTitle}" listed for ${listingPrice} on lelami.af 🇦🇫. Is it still available?`
        : lang === 'da'
          ? `سلام ${sellerName}، من به آگهی شما "${listingTitle}" به قیمت ${listingPrice} در لیلامی علاقمند هستم. آیا هنوز موجود است؟`
          : `سلام ${sellerName}، زه ستاسو اعلان "${listingTitle}" په باره کې په لیلامي ویبپاڼه کې معلومات غواړم. ایا اوس هم شته دی؟`;

    const encodedText = encodeURIComponent(textMessage);
    // Sanitize phone number (strip spaces, symbols)
    const sanitizedPhone = phoneNumber.replace(/[^a-zA-Z0-9]/g, '');
    const waUrl = `https://wa.me/${sanitizedPhone}?text=${encodedText}`;

    window.open(waUrl, '_blank', 'referrerPolicy=no-referrer');
  };

  const labels = {
    whatsapp: lang === 'en' ? 'WhatsApp Chat' : lang === 'da' ? 'چت واتساپ' : 'واټساپ چټ',
    call: lang === 'en' ? 'Call Seller' : lang === 'da' ? 'تماس تلفنی' : 'اړیکه نیول',
    reveal: lang === 'en' ? 'Reveal Phone' : lang === 'da' ? 'نمایش شماره تماس' : 'شماره ښودل',
  };

  return (
    <div className="flex flex-col gap-2.5 w-full select-none">
      {/* Phone Number Reveal Strip */}
      <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {lang === 'en' ? 'SELLER NUMBER' : lang === 'da' ? 'شماره فروشنده' : 'د پلورونکي شمیره'}
          </span>
          <span className="text-zinc-200 font-extrabold text-sm font-mono tracking-wider">
            {isRevealed ? phoneNumber : maskedPhone}
          </span>
        </div>

        {!isRevealed ? (
          <button
            onClick={() => setIsRevealed(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00b5a4]/15 border border-[#00b5a4]/30 text-[#00d4c0] text-[11px] font-extrabold hover:bg-[#00b5a4]/25 active:scale-95 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{labels.reveal}</span>
          </button>
        ) : (
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-extrabold active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span>{labels.call}</span>
          </a>
        )}
      </div>

      {/* Main Double Buttons: WhatsApp & Tel Call directly for Afghan users */}
      <div className="flex items-center gap-2.5 w-full">
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-500 active:scale-97 text-zinc-100 font-extrabold text-xs shadow-md shadow-green-900/20 transition-all cursor-pointer text-center"
        >
          <MessageCircle className="w-4 h-4 text-white fill-white" />
          <span>{labels.whatsapp}</span>
        </button>

        <a
          href={`tel:${phoneNumber}`}
          onClick={() => {
            if (!isRevealed) setIsRevealed(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-97 text-zinc-100 border border-zinc-700 font-extrabold text-xs transition-all cursor-pointer text-center"
        >
          <Phone className="w-4 h-4 text-[#00b5a4] fill-[#00b5a4]" />
          <span>{labels.call}</span>
        </a>
      </div>
    </div>
  );
}
