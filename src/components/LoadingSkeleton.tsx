import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse p-4">
      {/* Search Input Skeleton */}
      <div className="h-12 bg-zinc-800 rounded-xl w-full" />

      {/* Categories Horizontal Pills Skeleton */}
      <div className="flex gap-2 py-2 overflow-x-hidden">
        <div className="h-8 bg-zinc-800 rounded-full w-20 flex-shrink-0" />
        <div className="h-8 bg-zinc-800 rounded-full w-24 flex-shrink-0" />
        <div className="h-8 bg-zinc-800 rounded-full w-16 flex-shrink-0" />
        <div className="h-8 bg-zinc-800 rounded-full w-28 flex-shrink-0" />
      </div>

      {/* Grid of Card Skeletons */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col bg-zinc-900 rounded-2xl p-2 border border-zinc-805 gap-2.5">
            <div className="aspect-[4/3] bg-zinc-800 rounded-xl w-full" />
            <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
            <div className="h-3.5 bg-zinc-800 rounded-md w-1/2" />
            <div className="h-3 bg-zinc-800 rounded-md w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListingDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse p-4">
      {/* Top Banner Area */}
      <div className="aspect-[4/3] bg-zinc-800 rounded-2xl w-full" />

      {/* Title block */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-6 bg-zinc-800 rounded-lg w-5/6" />
        <div className="h-5 bg-zinc-800 rounded-lg w-1/3" />
      </div>

      {/* Row details */}
      <div className="flex gap-3 py-3 border-y border-zinc-800">
        <div className="h-8 bg-zinc-800 rounded-full w-24" />
        <div className="h-8 bg-zinc-800 rounded-full w-24" />
      </div>

      {/* Description lines */}
      <div className="flex flex-col gap-2.5">
        <div className="h-4 bg-zinc-800 rounded-md w-full" />
        <div className="h-4 bg-zinc-800 rounded-md w-full" />
        <div className="h-4 bg-zinc-800 rounded-md w-2/3" />
      </div>

      {/* Button skeletons */}
      <div className="flex gap-3 mt-4">
        <div className="h-12 bg-zinc-800 rounded-xl flex-1" />
        <div className="h-12 bg-zinc-800 rounded-xl flex-1" />
      </div>
    </div>
  );
}
