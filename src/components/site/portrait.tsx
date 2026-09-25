"use client";

import { usePortfolio } from "@/lib/store";

/** Hero portrait. Shows the uploaded photo when set (via /admin → Giới thiệu),
 *  otherwise a neutral gradient placeholder. */
export function Portrait() {
  const { data } = usePortfolio();
  const { yearsBadge, photo } = data.person;
  return (
    <div className="relative w-[360px] max-w-full justify-self-end">
      <div className="absolute -right-6 -top-10 h-56 w-56 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/20 blur-2xl" />
      <div className="relative aspect-[1/1.04] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 border border-white/80 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.18)]">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={data.person.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-end text-blue-900">
            <svg viewBox="0 0 200 210" fill="currentColor" className="-mb-0.5 w-[62%] opacity-85">
              <circle cx="100" cy="78" r="42" />
              <path d="M28 210c0-44 32-72 72-72s72 28 72 72z" />
            </svg>
          </div>
        )}
        {yearsBadge && (yearsBadge.value || yearsBadge.label) && (
          <div className="absolute bottom-4 left-4 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.12)] backdrop-blur-md">
            <b className="block font-display text-[15px] font-extrabold text-slate-900">{yearsBadge.value}</b>
            <span className="text-xs font-semibold text-slate-600">{yearsBadge.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
