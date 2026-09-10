'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import EventSidebar from './components/EventSidebar';
import AnalyticsSection from './components/AnalyticsSection';
import { NewsEvent } from './types/news';
import eventsData from '../data.json';
import { Compass } from 'lucide-react';

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 text-zinc-400">
      <Compass className="w-10 h-10 animate-spin text-blue-500 mb-3" />
      <p className="text-sm font-semibold tracking-wide text-zinc-300">
        Loading Interactive India Map...
      </p>
      <p className="text-xs text-zinc-500 mt-1">Plotting geocoded events across India</p>
    </div>
  ),
});

export default function Home() {
  const [events] = useState<NewsEvent[]>(eventsData as NewsEvent[]);
  const [selectedEvent, setSelectedEvent] = useState<NewsEvent | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);

  const handleResetView = () => {
    setSelectedEvent(null);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Navbar Header */}
      <Header
        totalEvents={events.length}
        onResetView={handleResetView}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden relative">
        {/* Interactive Event Sidebar */}
        <EventSidebar
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={(event) => setSelectedEvent(event)}
        />

        {/* Map Container */}
        <div className="flex-1 h-full min-h-[400px] relative">
          <MapComponent
            events={events}
            selectedEvent={selectedEvent}
            onSelectEvent={(event) => setSelectedEvent(event)}
            resetTrigger={resetTrigger}
          />
        </div>
      </main>

      {/* Data Visualization Analytics Modal */}
      <AnalyticsSection
        events={events}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}
