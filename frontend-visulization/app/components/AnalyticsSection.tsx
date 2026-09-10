'use client';

import { useMemo } from 'react';
import { NewsEvent } from '../types/news';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Heart,
  Eye,
  Layers,
  X,
  Compass,
} from 'lucide-react';

interface AnalyticsSectionProps {
  events: NewsEvent[];
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#f43f5e', // rose
  '#14b8a6', // teal
];

export default function AnalyticsSection({ events, isOpen, onClose }: AnalyticsSectionProps) {
  // Aggregate Category Data for Pie Chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      const cat = event.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.keys(counts).map((category) => ({
      name: category,
      value: counts[category],
    }));
  }, [events]);

  // Aggregate Top Cities Data for Bar Chart
  const cityData = useMemo(() => {
    return events.slice(0, 8).map((event) => {
      // Extract city name from title or source
      let city = 'City';
      if (event.title.includes('Delhi')) city = 'New Delhi';
      else if (event.title.includes('Mumbai')) city = 'Mumbai';
      else if (event.title.includes('Bengaluru')) city = 'Bengaluru';
      else if (event.title.includes('Chennai')) city = 'Chennai';
      else if (event.title.includes('Hyderabad')) city = 'Hyderabad';
      else if (event.title.includes('Kolkata')) city = 'Kolkata';
      else if (event.title.includes('Ahmedabad')) city = 'Ahmedabad';
      else if (event.title.includes('Pune')) city = 'Pune';
      else if (event.title.includes('Jaipur')) city = 'Jaipur';
      else if (event.title.includes('Kochi')) city = 'Kochi';
      else city = event.title.split(' ')[0];

      return {
        name: city,
        likes: event.likes_count,
        views: Math.round(event.views_count / 100),
      };
    });
  }, [events]);

  // Aggregate Timeline Area Chart Data
  const timelineData = useMemo(() => {
    return [...events]
      .sort(
        (a, b) =>
          new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
      )
      .slice(0, 10)
      .map((event) => ({
        date: new Date(event.published_at).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        }),
        likes: event.likes_count,
        views: Math.round(event.views_count / 100),
      }));
  }, [events]);

  // Totals
  const totalLikes = useMemo(
    () => events.reduce((sum, e) => sum + e.likes_count, 0),
    [events]
  );
  const totalViews = useMemo(
    () => events.reduce((sum, e) => sum + e.views_count, 0),
    [events]
  );
  const trendingCount = useMemo(
    () => events.filter((e) => e.is_trending).length,
    [events]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                India Event Analytics & Visualizations
              </h2>
              <p className="text-xs text-slate-400">
                Data insights, category distribution, and engagement metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Events</p>
                <p className="text-xl font-extrabold text-slate-100">{events.length}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Likes</p>
                <p className="text-xl font-extrabold text-slate-100">
                  {totalLikes.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Views</p>
                <p className="text-xl font-extrabold text-slate-100">
                  {(totalViews / 1000).toFixed(1)}k
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Trending Stories</p>
                <p className="text-xl font-extrabold text-slate-100">{trendingCount}</p>
              </div>
            </div>
          </div>

          {/* Charts Row 1: Pie Chart & Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart: Category Distribution */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col">
              <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-blue-400" />
                Category Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: City Engagement */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col">
              <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                City Engagement Metrics (Likes vs Views)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                    <Bar dataKey="likes" name="Likes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="views" name="Views (x100)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Area Chart: Timeline Trend */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col">
            <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Event Volume & Engagement Timeline Trend
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Area
                    type="monotone"
                    dataKey="likes"
                    name="Likes"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorLikes)"
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Views (x100)"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
