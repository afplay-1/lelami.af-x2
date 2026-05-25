import React from 'react';
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
    <div className="flex items-center bg-zinc-100/90 rounded-lg p-1 text-[10px] font-bold uppercase tracking-wider border border-zinc-200 select-none shadow-sm">
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => onLanguageChange(opt.code)}
          className={`px-2 py-0.5 rounded transition-all duration-205 cursor-pointer ${
            currentLang === opt.code
              ? 'bg-blue-600 text-white shadow font-black'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          {opt.code === 'da' ? 'DR' : opt.code === 'pa' ? 'PS' : 'EN'}
        </button>
      ))}
    </div>
  );
}
