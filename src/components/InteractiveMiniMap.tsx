import React, { useState } from 'react';
import { Plus, Minus, MapPin, Eye, Navigation, Globe, CheckCircle } from 'lucide-react';
import { Province } from '../types';
import { toLocalNumbers } from '../lib/i18n';

interface InteractiveMiniMapProps {
  province: Province;
  lang: 'en' | 'da' | 'pa';
}

interface ProvinceCoords {
  lat: number;
  lng: number;
  zoom: number;
  englishName: string;
  dariName: string;
  pashtoName: string;
}

const PROVINCE_MAP_DATA: Record<string, ProvinceCoords> = {
  Kabul: { lat: 34.5553, lng: 69.1771, zoom: 12, englishName: "Kabul", dariName: "کابل", pashtoName: "کابل" },
  Herat: { lat: 34.3520, lng: 62.2040, zoom: 12, englishName: "Herat", dariName: "هرات", pashtoName: "هرات" },
  Balkh: { lat: 36.7080, lng: 67.1104, zoom: 12, englishName: "Balkh (Mazar-i-Sharif)", dariName: "بلخ (مزار شریف)", pashtoName: "بلخ (مزار شرايف)" },
  Nangarhar: { lat: 34.4261, lng: 70.4514, zoom: 12, englishName: "Nangarhar (Jalanabad)", dariName: "ننگرهار (جلال‌آباد)", pashtoName: "ننگرهار (جلال اباد)" },
  Kandahar: { lat: 31.6289, lng: 65.7372, zoom: 12, englishName: "Kandahar", dariName: "کندهار", pashtoName: "کندهار" },
  Kunduz: { lat: 36.7290, lng: 68.8680, zoom: 12, englishName: "Kunduz", dariName: "کندز", pashtoName: "کندز" },
  Ghazni: { lat: 33.5492, lng: 68.4174, zoom: 12, englishName: "Ghazni", dariName: "غزنی", pashtoName: "غزني" },
  Kapisa: { lat: 35.0000, lng: 69.3500, zoom: 11, englishName: "Kapisa", dariName: "کاپیسا", pashtoName: "کاپیسا" },
  Logar: { lat: 34.0145, lng: 69.0464, zoom: 11, englishName: "Logar", dariName: "لوگر", pashtoName: "لوګر" },
};

export default function InteractiveMiniMap({ province, lang }: InteractiveMiniMapProps) {
  const [zoom, setZoom] = useState<number>(12);
  const [isDarkMap, setIsDarkMap] = useState<boolean>(false);

  const isRTL = lang === 'da' || lang === 'pa';
  
  const data = PROVINCE_MAP_DATA[province] || {
    lat: 33.9391,
    lng: 67.7100,
    zoom: 7,
    englishName: province || "Afghanistan",
    dariName: province || "افغانستان",
    pashtoName: province || "افغانستان",
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 2, 6));
  };

  const span = 0.1 / Math.pow(2, zoom - 11);
  const left = data.lng - span;
  const right = data.lng + span;
  const bottom = data.lat - span / 1.5;
  const top = data.lat + span / 1.5;
  
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${data.lat}%2C${data.lng}`;

  const labelTitle = {
    en: "Location Map",
    da: "نقشه موقعیت محصول",
    pa: "د موقعيت نقشه"
  }[lang] || "Location Map";

  const labelApprox = {
    en: "Approximate Area",
    da: "موقعیت تقریبی",
    pa: "نږدې سیمه"
  }[lang] || "Approximate Area";

  const labelPrivacy = {
    en: "Safe Public Area (Exact address hidden for safety)",
    da: "ساحه عمومی مصون (آدرس دقیق جهت امنیت نمایش داده نمی‌شود)",
    pa: "خوندي عامه سیمه (د امنیت لپاره دقیق پته نشته)"
  }[lang] || "Safe Public Area";

  const provinceNameLocalized = lang === 'da' ? data.dariName : lang === 'pa' ? data.pashtoName : data.englishName;

  return (
    <div className="bg-white border border-zinc-200 rounded-[28px] overflow-hidden p-4 flex flex-col gap-3 shadow-sm" id="interactive-minimap-card">
      {/* Header Info */}
      <div className="flex items-center justify-between" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/15 flex items-center justify-center text-blue-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">{labelTitle}</span>
            <span className="text-xs font-black text-zinc-800">{provinceNameLocalized}</span>
          </div>
        </div>

        {/* GPS Coordinates & Accuracy */}
        <div className="flex flex-col items-end text-right font-mono text-[10px]">
          <span className="text-blue-600 font-bold">{toLocalNumbers(data.lat.toFixed(4), lang)}° N, {toLocalNumbers(data.lng.toFixed(4), lang)}° E</span>
          <span className="text-zinc-400 text-[9px] flex items-center gap-1 font-sans font-bold">
            <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
            <span>{labelApprox}</span>
          </span>
        </div>
      </div>

      {/* Main Map Interactive Box */}
      <div className="relative w-full aspect-[21/9] min-h-[160px] rounded-2xl overflow-hidden border border-zinc-200 group">
        
        {/* OSM Map Frame */}
        <iframe
          title="LeLami.af MiniMap"
          src={osmUrl}
          className="w-full h-full border-none pointer-events-auto transition-transform duration-300"
          style={{
            filter: isDarkMap 
              ? 'invert(90%) hue-rotate(180deg) brightness(88%) contrast(110%) saturate(80%)' 
              : 'none'
          }}
          allowFullScreen
          loading="lazy"
        />

        {/* Dynamic decorative center mapping core */}
        <div className="absolute inset-x-0 top-1/2 -mt-7 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-600/20 opacity-75"></span>
            <span className="animate-pulse absolute inline-flex h-6 w-6 rounded-full bg-blue-600/40"></span>
            
            <div className="relative w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Control Buttons inside MiniMap */}
        <div className={`absolute bottom-3 flex items-center gap-2 z-10 ${isRTL ? 'left-3' : 'right-3'}`}>
          <button
            onClick={() => setIsDarkMap(!isDarkMap)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-650 text-[10px] font-extrabold hover:text-blue-600 hover:border-blue-500/30 transition-colors cursor-pointer select-none shadow-sm"
          >
            {isDarkMap ? "🗺️ Classic" : "🕶️ Tactical"}
          </button>

          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-650 flex items-center justify-center hover:text-blue-600 hover:border-blue-500/30 active:scale-90 transition-all cursor-pointer shadow-sm"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-650 flex items-center justify-center hover:text-blue-600 hover:border-blue-500/30 active:scale-90 transition-all cursor-pointer shadow-sm"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Compass Banner tag overlay */}
        <div className={`absolute top-3 bg-white/90 border border-zinc-200 px-2 py-0.5 rounded text-[8px] font-extrabold text-zinc-500 tracking-wider flex items-center gap-1 ${isRTL ? 'right-3' : 'left-3'} shadow-sm`}>
          <Navigation className="w-2.5 h-2.5 text-blue-600 rotate-45" />
          <span>AF-MAPPING ENGINE</span>
        </div>
      </div>

      {/* footer warning banner */}
      <span className="text-[10px] text-zinc-400 font-bold text-center italic leading-tight">
        {labelPrivacy}
      </span>
    </div>
  );
}
