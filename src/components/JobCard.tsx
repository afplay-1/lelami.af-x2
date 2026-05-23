import React from 'react';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  key?: string;
  job: Job;
  lang: 'en' | 'da' | 'pa';
  onClick: () => void;
}

export default function JobCard({ job, lang, onClick }: JobCardProps) {
  const getTitle = () => {
    if (lang === 'da' && job.titleDari) return job.titleDari;
    if (lang === 'pa' && job.titlePashto) return job.titlePashto;
    return job.title;
  };

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[240px] bg-white/5 border border-white/10 rounded-[24px] p-4 font-sans hover:border-orange-500/30 transition-all select-none cursor-pointer active:scale-98 shadow-sm flex flex-col justify-between backdrop-blur-md"
    >
      <div>
        {/* Header Logo & Header Meta */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={job.companyName}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Briefcase className="w-6 h-6 text-orange-500" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-zinc-100 font-extrabold text-sm truncate">{job.companyName}</h4>
            <span className="inline-block px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/10 text-[10px] font-bold mt-1">
              {job.jobType}
            </span>
          </div>
        </div>

        {/* Title */}
        <p className="mt-3.5 text-zinc-200 font-bold text-sm leading-snug line-clamp-2 h-10 select-none">
          {getTitle()}
        </p>
      </div>

      {/* Footer metadata */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col gap-1.5 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 text-orange-400 font-bold">
            <DollarSign className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>
    </div>
  );
}
