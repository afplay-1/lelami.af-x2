import React from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  sellerName: string;
  listingTitle: string;
  listingPrice: string;
  lang: 'en' | 'da' | 'pa';
  onMessageClick: () => void;
}

export default function WhatsAppButton({
  phoneNumber,
  sellerName,
  listingTitle,
  listingPrice,
  lang,
  onMessageClick,
}: WhatsAppButtonProps) {

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
    chatInApp: lang === 'en' ? 'Message Seller' : lang === 'da' ? 'ارسال پیام در لیلامی' : 'ليلامي کې پیغام ولیږئ',
  };

  return (
    <div className="flex items-center gap-3 w-full select-none mt-2.5">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#10b981] hover:bg-[#059669] active:scale-97 text-white font-extrabold text-xs shadow-md shadow-emerald-920/10 transition-all cursor-pointer text-center"
      >
        <MessageCircle className="w-4 h-4 text-white fill-white shrink-0" />
        <span>{labels.whatsapp}</span>
      </button>

      {/* Lelami Chat Button */}
      <button
        onClick={onMessageClick}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-97 text-white font-extrabold text-xs shadow-md shadow-blue-900/10 transition-all cursor-pointer text-center"
      >
        <MessageSquare className="w-4 h-4 text-white shrink-0" />
        <span>{labels.chatInApp}</span>
      </button>
    </div>
  );
}
