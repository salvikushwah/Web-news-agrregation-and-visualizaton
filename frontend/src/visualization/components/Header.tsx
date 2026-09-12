'use client';

import { Globe, RefreshCw, Compass, BarChart3, House } from 'lucide-react';

interface HeaderProps {
  totalEvents: number;
  onResetView: () => void;
  onOpenAnalytics: () => void;
  onNavigateHome: () => void;
}

export default function Header({
  totalEvents,
  onResetView,
  onOpenAnalytics,
  onNavigateHome,
}: HeaderProps) {
  return (
    <header className="visualization-header w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg z-20">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-100 flex items-center gap-2">
            BharatPulse
            <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-950/80 text-blue-400 border border-blue-800/80">
              India Live Map
            </span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Geo-tagged news & event intelligence map
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="visualization-header-actions flex items-center gap-2.5 sm:gap-3 flex-wrap">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 px-3.5 py-2 h-9 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <House className="w-4 h-4 text-slate-400" />
          <span>Dashboard</span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>{totalEvents} Geocoded Events</span>
        </div>

        {/* Analytics Button */}
        <button
          onClick={onOpenAnalytics}
          className="flex items-center gap-2 px-3.5 py-2 h-9 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 border border-blue-500 active:scale-95 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Visualizations</span>
        </button>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="flex items-center gap-2 px-3.5 py-2 h-9 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-white text-slate-900 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-700" />
          <span>Reset Map View</span>
        </button>
      </div>
    </header>
  );
}
