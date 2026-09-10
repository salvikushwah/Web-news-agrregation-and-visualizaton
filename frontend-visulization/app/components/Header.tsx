'use client';

import { Globe, RefreshCw, Compass, BarChart3 } from 'lucide-react';

interface HeaderProps {
  totalEvents: number;
  onResetView: () => void;
  onOpenAnalytics: () => void;
}

export default function Header({
  totalEvents,
  onResetView,
  onOpenAnalytics,
}: HeaderProps) {
  return (
    <header className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm z-20">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            BharatPulse
            <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              India Live Map
            </span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
            Geo-tagged news & event intelligence map
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>{totalEvents} Geocoded Events</span>
        </div>

        {/* Analytics Button */}
        <button
          onClick={onOpenAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm active:scale-95"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Visualizations</span>
        </button>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Map View</span>
        </button>
      </div>
    </header>
  );
}
