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
    <aside className="w-full lg:w-96 flex flex-col h-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Events Feed
          </h2>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {filteredEvents.length} items
          </span>
        </div>

        {/* View Tabs: All vs Trending */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>All Events</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-md'
                : 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Trending ({trendingEvents.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search news, cities, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/80 border border-transparent focus:border-blue-500 rounded-xl outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
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
        <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-transparent border-b border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-current" />
            Top Trending Stories across India
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-200 font-extrabold px-2 py-0.5 rounded-full">
            Ranked by Engagement
          </span>
        </div>
      )}

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
            <Filter className="w-8 h-8 mb-2 stroke-1 opacity-50" />
            <p className="text-sm font-medium">No matching events found</p>
            <p className="text-xs text-zinc-500 mt-1">Try resetting search query or filters</p>
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
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500/20'
                    : event.is_trending
                    ? 'bg-gradient-to-br from-amber-500/5 to-red-500/5 dark:from-amber-950/20 dark:to-red-950/20 border-amber-200 dark:border-amber-900/40 hover:border-amber-400'
                    : 'bg-white dark:bg-zinc-800/40 border-zinc-100 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm'
                }`}
              >
                {/* Badges Bar */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {event.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
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

                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3 h-3" />
                    {event.time_ago ||
                      new Date(event.published_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1.5">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  {event.description}
                </p>

                {/* Engagement Metrics Bar */}
                <div className="flex items-center gap-3 py-1.5 px-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 mb-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-1 text-rose-500">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {event.likes_count.toLocaleString()}
                  </span>

                  <span className="flex items-center gap-1 text-blue-500">
                    <Eye className="w-3.5 h-3.5" />
                    {(event.views_count / 1000).toFixed(1)}k
                  </span>

                  {event.read_time_mins && (
                    <span className="text-[11px] text-zinc-400 ml-auto">
                      {event.read_time_mins} min read
                    </span>
                  )}
                </div>

                {/* Footer Coordinates & Navigation */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                  <span className="flex items-center gap-1 text-zinc-400 font-medium text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {event.latitude.toFixed(2)}°, {event.longitude.toFixed(2)}°
                  </span>

                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
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
