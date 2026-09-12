import { useState } from "react";
import eventsData from "./data/events.json";
import Header from "./components/Header";
import EventSidebar from "./components/EventSidebar";
import MapComponent from "./components/MapComponent";
import AnalyticsSection from "./components/AnalyticsSection";

export default function VisualizationPage({ onNavigateHome }) {
  const [events] = useState(eventsData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const resetView = () => {
    setSelectedEvent(null);
    setResetTrigger((value) => value + 1);
  };

  return (
    <div className="visualization-page dark">
      <Header totalEvents={events.length} onResetView={resetView} onOpenAnalytics={() => setIsAnalyticsOpen(true)} onNavigateHome={onNavigateHome} />
      <main className="visualization-workspace">
        <EventSidebar events={events} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} />
        <div className="visualization-map-panel">
          <MapComponent events={events} selectedEvent={selectedEvent} onSelectEvent={setSelectedEvent} resetTrigger={resetTrigger} />
        </div>
      </main>
      <AnalyticsSection events={events} isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
    </div>
  );
}
