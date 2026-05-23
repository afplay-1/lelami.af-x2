import React from 'react';
import { MapPin } from 'lucide-react';
import { Province } from '../types';

interface ProvinceSelectorProps {
  selectedProvince: Province | '';
  onChange: (province: Province | '') => void;
  lang: 'en' | 'da' | 'pa';
  className?: string;
}

export const AFGHAN_PROVINCES: { id: Province; en: string; da: string; pa: string }[] = [
  { id: 'Kabul', en: 'Kabul', da: 'کابل', pa: 'کابل' },
  { id: 'Herat', en: 'Herat', da: 'هرات', pa: 'هرات' },
  { id: 'Balkh', en: 'Balkh', da: 'بلخ (مزار شریف)', pa: 'بلخ (مزار شریف)' },
  { id: 'Nangarhar', en: 'Nangarhar', da: 'ننگرهار (جلال‌آباد)', pa: 'ننگرهار (جلال‌آباد)' },
  { id: 'Kandahar', en: 'Kandahar', da: 'کندهار', pa: 'کندهار' },
  { id: 'Kunduz', en: 'Kunduz', da: 'کندز', pa: 'کندوز' },
  { id: 'Ghazni', en: 'Ghazni', da: 'غزنی', pa: 'غزني' },
  { id: 'Kapisa', en: 'Kapisa', da: 'کاپیسا', pa: 'کاپیسا' },
  { id: 'Logar', en: 'Logar', da: 'لوگر', pa: 'لوګر' },
  { id: 'Baghlan', en: 'Baghlan', da: 'بغلان', pa: 'بغلان' },
  { id: 'Bamyan', en: 'Bamyan', da: 'بامیان', pa: 'بامیان' },
  { id: 'Paktia', en: 'Paktia', da: 'پکتیا', pa: 'پکتیا' },
];

export default function ProvinceSelector({
  selectedProvince,
  onChange,
  lang,
  className = '',
}: ProvinceSelectorProps) {
  const getPrompt = () => {
    return lang === 'en'
      ? 'Filter by District / Province'
      : lang === 'da'
        ? 'فیلتر بر اساس ولایت'
        : 'د ولایت پر بنسټ فلټر کړئ';
  };

  const getLabel = (item: typeof AFGHAN_PROVINCES[0]) => {
    return lang === 'da' ? item.da : lang === 'pa' ? item.pa : item.en;
  };

  return (
    <div className={`relative flex items-center bg-[#101010] border border-white/10 rounded-xl overflow-hidden px-3 py-1 ${className}`}>
      <MapPin className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
      <select
        value={selectedProvince}
        onChange={(e) => onChange(e.target.value as Province | '')}
        className="w-full bg-transparent border-none text-xs font-bold text-zinc-200 outline-none cursor-pointer py-1.5 focus:text-white"
        style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }}
      >
        <option value="" className="bg-[#101010] text-zinc-400 font-bold">
          {getPrompt()}
        </option>
        {AFGHAN_PROVINCES.map((prov) => (
          <option key={prov.id} value={prov.id} className="bg-[#101010] text-zinc-100">
            {getLabel(prov)}
          </option>
        ))}
      </select>
    </div>
  );
}
