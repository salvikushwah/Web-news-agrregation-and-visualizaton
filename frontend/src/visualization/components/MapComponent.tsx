'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NewsEvent } from '../types/news';
import { ExternalLink, Tag, Compass, Flame, Heart, Eye, Clock } from 'lucide-react';

interface MapComponentProps {
  events: NewsEvent[];
  selectedEvent: NewsEvent | null;
  onSelectEvent: (event: NewsEvent) => void;
  resetTrigger: number;
}

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];
const DEFAULT_ZOOM = 5;

const categoryColors: Record<string, { bg: string; border: string }> = {
  'Energy & Infrastructure': { bg: '#10b981', border: '#059669' },
  'Finance & Tech': { bg: '#f59e0b', border: '#d97706' },
  'Artificial Intelligence': { bg: '#6366f1', border: '#4f46e5' },
  'Smart Mobility': { bg: '#06b6d4', border: '#0891b2' },
  'Healthcare & Biotech': { bg: '#ec4899', border: '#db2777' },
  'Urban Planning': { bg: '#8b5cf6', border: '#7c3aed' },
  'Clean Energy': { bg: '#10b981', border: '#047857' },
  'Automotive & EV': { bg: '#3b82f6', border: '#2563eb' },
  'Culture & Arts': { bg: '#f43f5e', border: '#e11d48' },
  'Sustainable Transport': { bg: '#14b8a6', border: '#0d9488' },
};

const getCategoryColor = (category?: string) => {
  if (category && categoryColors[category]) {
    return categoryColors[category];
  }
  return { bg: '#3b82f6', border: '#1d4ed8' };
};

const createCustomMarker = (category?: string, isSelected?: boolean, isTrending?: boolean) => {
  const color = isTrending ? { bg: '#f97316', border: '#ea580c' } : getCategoryColor(category);
  const size = isSelected ? 38 : isTrending ? 34 : 28;
  const pulseClass = isSelected || isTrending ? 'animate-ping opacity-75' : '';

  const flameBadge = isTrending
    ? `<div style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border: 2px solid white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">T</div>`
    : '';

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color.bg}; opacity: 0.35;" class="${pulseClass}"></div>
      <div style="position: relative; width: ${size - 4}px; height: ${size - 4}px; border-radius: 50%; background-color: ${color.bg}; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: white;"></div>
      </div>
      ${flameBadge}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

function MapController({
  selectedEvent,
  resetTrigger,
}: {
  selectedEvent: NewsEvent | null;
  resetTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedEvent) {
      map.flyTo([selectedEvent.latitude, selectedEvent.longitude], 10, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [selectedEvent, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(INDIA_CENTER, DEFAULT_ZOOM, {
        duration: 1.2,
      });
    }
  }, [resetTrigger, map]);

  return null;
}

export default function MapComponent({
  events,
  selectedEvent,
  onSelectEvent,
  resetTrigger,
}: MapComponentProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
      <MapContainer
        center={INDIA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#f8fafc' }}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController selectedEvent={selectedEvent} resetTrigger={resetTrigger} />

        {events.map((event) => {
          const isSelected = selectedEvent?.id === event.id;

          return (
            <Marker
              key={event.id}
              position={[event.latitude, event.longitude]}
              icon={createCustomMarker(event.category, isSelected, event.is_trending)}
              eventHandlers={{
                click: () => onSelectEvent(event),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1.5 max-w-xs font-sans text-zinc-900">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {event.category && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                        <Tag className="w-2.5 h-2.5" />
                        {event.category}
                      </span>
                    )}

                    {event.is_trending && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-sm">
                        <Flame className="w-3 h-3 fill-current" />
                        #{event.trending_rank} Trending
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm leading-snug mb-1 text-zinc-900">
                    {event.title}
                  </h3>

                  <p className="text-xs text-zinc-600 line-clamp-3 mb-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between py-2 px-2.5 bg-zinc-100/80 rounded-xl mb-3 text-xs font-medium text-zinc-600">
                    <span className="flex items-center gap-1 text-rose-600">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      {event.likes_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600">
                      <Eye className="w-3.5 h-3.5" />
                      {(event.views_count / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time_ago || 'Recent'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Compass className="w-3 h-3 shrink-0" />
                      <span>
                        {event.latitude.toFixed(2)}° N, {event.longitude.toFixed(2)}° E
                      </span>
                    </div>

                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Read Story
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl text-xs font-semibold text-slate-200">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <span>India Live Event Map</span>
        </div>
        <span className="bg-blue-950/80 border border-blue-800/80 text-blue-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          {events.length} Live Pins
        </span>
        <span className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
          <Flame className="w-3.5 h-3.5 fill-current" />
          {events.filter((e) => e.is_trending).length} Trending Stories
        </span>
      </div>
    </div>
  );
}
