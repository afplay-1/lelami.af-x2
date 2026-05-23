import React from 'react';
import { Languages } from 'lucide-react';
import { LanguageCode } from '../lib/i18n';

interface LanguageSwitcherProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export default function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const options: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'da', label: 'دری' },
    { code: 'pa', label: 'پښتو' },
  ];

  return (
    <div className="flex items-center bg-white/5 rounded-lg p-1 text-[10px] font-bold uppercase tracking-wider border border-white/10 select-none">
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => onLanguageChange(opt.code)}
          className={`px-2 py-0.5 rounded transition-all duration-200 cursor-pointer ${
            currentLang === opt.code
              ? 'bg-orange-500 text-black shadow-sm font-black'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {opt.code === 'da' ? 'DR' : opt.code === 'pa' ? 'PS' : 'EN'}
        </button>
      ))}
    </div>
  );
}
