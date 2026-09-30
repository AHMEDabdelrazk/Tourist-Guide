import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CountryTab } from './components/CountryTab';
import { PlacesTab } from './components/PlacesTab';
import { TripHistoryTab } from './components/TripHistoryTab';
import { TravelAnalyticsTab } from './components/TravelAnalyticsTab';
import { TravelToolsTab } from './components/TravelToolsTab';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { AddToTripModal } from './components/AddToTripModal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2 } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('countries');
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [addToTripPlaceId, setAddToTripPlaceId] = useState<number | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTripAdded = () => {
    showToast('Destination successfully saved to your Trip History! ✈️');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {activeTab === 'countries' && (
          <CountryTab
            onSelectPlace={(id) => setSelectedPlaceId(id)}
            onOpenAddToTrip={(id) => setAddToTripPlaceId(id)}
          />
        )}

        {activeTab === 'places' && (
          <PlacesTab
            onSelectPlace={(id) => setSelectedPlaceId(id)}
            onOpenAddToTrip={(id) => setAddToTripPlaceId(id)}
          />
        )}

        {activeTab === 'trips' && (
          <TripHistoryTab
            onNavigateToCountries={() => setActiveTab('countries')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <TravelAnalyticsTab />
        )}

        {activeTab === 'tools' && (
          <TravelToolsTab />
        )}
      </main>

      {/* Modals */}
      <PlaceDetailModal
        placeId={selectedPlaceId}
        onClose={() => setSelectedPlaceId(null)}
        onOpenAddToTrip={(id) => {
          setSelectedPlaceId(null);
          setAddToTripPlaceId(id);
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <AddToTripModal
        placeId={addToTripPlaceId}
        onClose={() => setAddToTripPlaceId(null)}
        onSuccess={handleTripAdded}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">GlobalGuide</span>
            <span>• Enterprise Tourist Guide Platform for Outlier Evaluation</span>
          </div>
          <p>© 2026 GlobalGuide Travel Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
