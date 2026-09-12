'use client';

import { useState, useMemo } from 'react';
import { NewsEvent } from '../types/news';
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  Navigation,
  Flame,
  Heart,
  Eye,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface EventSidebarProps {
  events: NewsEvent[];
  selectedEvent: NewsEvent | null;
  onSelectEvent: (event: NewsEvent) => void;
}

export default function EventSidebar({
  events,
  selectedEvent,
  onSelectEvent,
}: EventSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'trending'>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ['All', ...Array.from(set)];
  }, [events]);

  const trendingEvents = useMemo(() => {
    return [...events]
      .filter((e) => e.is_trending || e.likes_count > 2500)
      .sort((a, b) => (a.trending_rank || 99) - (b.trending_rank || 99));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const sourceList = activeTab === 'trending' ? trendingEvents : events;

    return sourceList.filter((event) => {
      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;

      const matchesSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.source && event.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [events, trendingEvents, activeTab, selectedCategory, searchQuery]);

  return (
    <aside className="visualization-sidebar w-full lg:w-96 flex flex-col h-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-4 border-b border-slate-800 flex flex-col gap-3.5 shrink-0 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Events Feed
          </h2>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/80">
            {filteredEvents.length} items
          </span>
        </div>

        {/* View Tabs: All vs Trending */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>All Events</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-md font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Trending ({trendingEvents.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search news, cities, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl outline-none text-slate-100 placeholder-slate-500 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-0.5">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-[11px] font-semibold px-3 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 border border-blue-500'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Trending Spotlight Header if tab is trending */}
      {activeTab === 'trending' && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-amber-950/40 via-red-950/30 to-slate-900 border-b border-amber-800/40 text-xs text-amber-300 font-medium flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1.5 font-bold">
            <Flame className="w-4 h-4 text-amber-400 fill-current" />
            Top Trending Stories across India
          </span>
          <span className="text-[10px] bg-amber-900/40 border border-amber-700/50 text-amber-200 font-extrabold px-2 py-0.5 rounded-full">
            Ranked by Engagement
          </span>
        </div>
      )}

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <Filter className="w-8 h-8 mb-2 stroke-1 opacity-50 text-slate-500" />
            <p className="text-sm font-semibold text-slate-300">No matching events found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting search query or filters</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isSelected = selectedEvent?.id === event.id;

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : event.is_trending
                    ? 'bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-red-950/30 border-amber-900/50 hover:border-amber-500/80 shadow-md'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 shadow-sm'
                }`}
              >
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {event.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/80 group-hover:border-blue-500/60 group-hover:text-blue-300 transition-colors">
                        {event.category}
                      </span>
                    )}

                    {event.is_trending && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-xs">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        #{event.trending_rank} Trending
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {event.time_ago ||
                      new Date(event.published_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {event.description}
                </p>

                {/* Engagement Metrics Bar */}
                <div className="flex items-center gap-3.5 py-2 px-3 rounded-lg bg-slate-900/90 border border-slate-800/80 mb-3 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {event.likes_count.toLocaleString()}
                  </span>

                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Eye className="w-3.5 h-3.5" />
                    {(event.views_count / 1000).toFixed(1)}k
                  </span>

                  {event.read_time_mins && (
                    <span className="text-[11px] text-slate-400 ml-auto font-normal">
                      {event.read_time_mins} min read
                    </span>
                  )}
                </div>

                {/* Footer Coordinates & Navigation */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {event.latitude.toFixed(2)}°, {event.longitude.toFixed(2)}°
                  </span>

                  <button className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all">
                    <span>Fly to Pin</span>
                    <Navigation className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
