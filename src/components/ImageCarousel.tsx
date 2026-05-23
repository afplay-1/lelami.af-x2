import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-zinc-805 flex items-center justify-center text-zinc-500 font-bold text-sm">
        No Images Provided
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden group select-none">
      {/* Slider Viewport */}
      <img
        src={images[activeIndex]}
        alt={`${alt} - Slide ${activeIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-300"
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      {/* Slide Index Counter Badge */}
      <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold font-mono tracking-widest z-10 border border-zinc-700/30">
        {activeIndex + 1} / {images.length}
      </div>

      {/* Navigation Arrows (Hidden on touch mobile but active on hover/desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-neutral-700/20 text-white cursor-pointer hover:bg-black/80 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-neutral-700/20 text-white cursor-pointer hover:bg-black/80 transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Navigation Bullets */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? 'w-4.5 bg-[#00b5a4]' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
