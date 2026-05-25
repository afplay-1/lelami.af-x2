import React from 'react';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Job } from '../types';
import { toLocalNumbers, translateLocation } from '../lib/i18n';

interface JobCardProps {
  key?: string;
  job: Job;
  lang: 'en' | 'da' | 'pa';
  onClick: () => void;
}

export default function JobCard({ job, lang, onClick }: JobCardProps) {
  const getTitle = () => {
    let rawTitle = job.title;
    if (lang === 'da' && job.titleDari) rawTitle = job.titleDari;
    if (lang === 'pa' && job.titlePashto) rawTitle = job.titlePashto;
    return toLocalNumbers(rawTitle, lang);
  };

  const getCompany = () => {
    return toLocalNumbers(job.companyName, lang);
  };

  const getSalary = () => {
    return job.salary ? toLocalNumbers(job.salary, lang) : '';
  };

  const getLocation = () => {
    return translateLocation(job.location, lang);
  };

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[240px] bg-white border border-zinc-200 rounded-[24px] p-4 font-sans hover:border-blue-500/30 transition-all select-none cursor-pointer active:scale-98 shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Header Logo & Header Meta */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt={job.companyName}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Briefcase className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-zinc-900 font-extrabold text-sm truncate">{getCompany()}</h4>
            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600 border border-blue-200/50 text-[10px] font-bold mt-1">
              {job.jobType === 'Full-time' ? (lang === 'en' ? 'Full-time' : lang === 'da' ? 'تمام‌وقت' : 'بشپړ وخت') : (lang === 'en' ? 'Contract' : lang === 'da' ? 'قراردادی' : 'قراردادي')}
            </span>
          </div>
        </div>

        {/* Title */}
        <p className="mt-3.5 text-zinc-700 font-bold text-sm leading-snug line-clamp-2 h-10 select-none">
          {getTitle()}
        </p>
      </div>

      {/* Footer metadata */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col gap-1.5 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span className="truncate">{getLocation()}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 text-blue-600 font-bold">
            <DollarSign className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
            <span>{getSalary()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
