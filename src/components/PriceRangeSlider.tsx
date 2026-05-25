import React, { useRef, useEffect, useCallback } from 'react';
import { toLocalNumbers } from '../lib/i18n';

interface PriceRangeSliderProps {
  minVal: number;
  maxVal: number;
  minLimit: number;
  maxLimit: number;
  step?: number;
  onChange: (min: number, max: number) => void;
  lang: 'en' | 'da' | 'pa';
}

export default function PriceRangeSlider({
  minVal,
  maxVal,
  minLimit,
  maxLimit,
  step = 5000,
  onChange,
  lang,
}: PriceRangeSliderProps) {
  const minValRef = useRef<number>(minVal);
  const maxValRef = useRef<number>(maxVal);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100),
    [minLimit, maxLimit]
  );

  // Set width of the range selection to decrease/increase from the left side
  useEffect(() => {
    if (maxValRef.current !== undefined) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent, maxVal]);

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxVal - step);
    onChange(value, maxVal);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minVal + step);
    onChange(minVal, value);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AFN',
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace('AFN', 'AFN ');
  };

  const isRTL = lang === 'da' || lang === 'pa';

  return (
    <div className="flex flex-col gap-4 mt-2 select-none w-full">
      {/* Absolute Overlaid Slider */}
      <div className="relative h-6 flex items-center w-full">
        {/* Underlay Track */}
        <div className="absolute h-1.5 w-full bg-zinc-200 rounded-full z-0 pointer-events-none" />

        {/* Selected Accent Track */}
        <div
          ref={rangeRef}
          className="absolute h-1.5 bg-blue-600 rounded-full z-10 pointer-events-none shadow-[0_0_8px_rgba(37,99,235,0.35)]"
        />

        {/* Input sliders */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 outline-none
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:scale-125 focus:outline-none"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 outline-none
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:scale-125 focus:outline-none"
        />
      </div>

      {/* Manual Inputs synchronized with the sliders */}
      <div className="flex gap-2.5 items-center w-full" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wide text-left">
            {lang === 'en' ? 'Min (AFN)' : lang === 'da' ? 'حداقل (افغانی)' : 'لږترلږه (افغانۍ)'}
          </span>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={minVal === 0 ? '' : minVal}
            onChange={(e) => {
              const val = Math.max(0, Math.min(Number(e.target.value), maxVal - step));
              onChange(val, maxVal);
            }}
            placeholder="0"
            className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-mono font-extrabold text-zinc-800 outline-none focus:border-blue-500/40 shadow-sm"
          />
        </div>

        <span className="text-zinc-400 font-extrabold mt-4">—</span>

        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wide text-left">
            {lang === 'en' ? 'Max (AFN)' : lang === 'da' ? 'حداکثر (افغانی)' : 'لوړ پوره (افغانۍ)'}
          </span>
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={maxVal === maxLimit ? '' : maxVal}
            onChange={(e) => {
              const val = Math.max(minVal + step, Math.min(Number(e.target.value), maxLimit));
              onChange(minVal, val);
            }}
            placeholder={toLocalNumbers(formatCurrency(maxLimit), lang)}
            className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-mono font-extrabold text-zinc-805 outline-none focus:border-blue-500/40 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
