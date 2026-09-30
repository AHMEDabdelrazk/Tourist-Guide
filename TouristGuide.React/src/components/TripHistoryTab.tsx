import React, { useState, useEffect } from 'react';
import { TripEntry, TripStats, TripStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Luggage, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Compass, 
  Plus, 
  Car, 
  Users, 
  FileText, 
  Sparkles, 
  Globe2 
} from 'lucide-react';

interface TripHistoryTabProps {
  onNavigateToCountries: () => void;
  onOpenAuth: () => void;
}

export const TripHistoryTab: React.FC<TripHistoryTabProps> = ({ 
  onNavigateToCountries, 
  onOpenAuth 
}) => {
  const { user, isAuthenticated, loginAsDemo } = useAuth();
  const [trips, setTrips] = useState<TripEntry[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  useEffect(() => {
    if (isAuthenticated) {
      loadTripsAndStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadTripsAndStats = async () => {
    try {
      setLoading(true);
      const [tripsData, statsData] = await Promise.all([
        api.getUserTrips(),
        api.getTripStats()
      ]);
      setTrips(tripsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this trip from your history?')) return;
    try {
      await api.deleteTrip(id);
      loadTripsAndStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete trip');
    }
  };

  const handleToggleStatus = async (trip: TripEntry) => {
    const nextStatus: TripStatus = trip.status === 'Visited' ? 'Planned' : 'Visited';
    try {
      await api.updateTrip(trip.id, {
        status: nextStatus,
        visitDate: nextStatus === 'Visited' && !trip.visitDate ? new Date().toISOString().split('T')[0] : trip.visitDate,
        notes: trip.notes,
        userRating: nextStatus === 'Visited' ? (trip.userRating || 5) : undefined,
        actualCostUSD: trip.actualCostUSD,
        travelMode: trip.travelMode,
        travelBuddy: trip.travelBuddy
      });
      loadTripsAndStats();
    } catch (err: any) {
      alert(err.message || 'Failed to update trip status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-500/25">
            <Luggage className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Track Your Personal Travel History
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Log the places you've visited, calculate total trip expenses, rate destinations, and organize your future dream itinerary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={loginAsDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>One-Click Demo Traveler Login</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              Sign In or Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredTrips = trips.filter((t) => {
    if (selectedStatus === 'All') return true;
    return t.status === selectedStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Header and User greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 inline-block mb-2">
            Personal Travel Log & Itinerary
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {user?.fullName || user?.username}'s Trip History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage visited destinations, planned adventures, ratings, notes, and travel expenses
          </p>
        </div>

        <button
          onClick={onNavigateToCountries}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-sky-500/20 transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination from Countries</span>
        </button>
      </div>

      {/* Analytics / Stats Cards Banner */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Countries Explored
              </span>
              <Globe2 className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.countriesExplored}
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {stats.countriesVisitedList.length > 0
                ? stats.countriesVisitedList.join(', ')
                : 'No countries marked visited yet'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Places Logged
              </span>
              <MapPin className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.totalTrips}
            </div>
            <div className="flex gap-2 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">{stats.visitedCount} Visited</span>
              <span>•</span>
              <span className="text-sky-400 font-bold">{stats.plannedCount} Planned</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Travel Spend
              </span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mb-1">
              ${stats.totalExpenditureUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-slate-400">
              Logged travel expenditures
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Average Rating
              </span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400 mb-1">
              {stats.averageUserRating > 0 ? `${stats.averageUserRating} / 5.0` : 'N/A'}
            </div>
            <p className="text-[10px] text-slate-400">
              Across your visited destinations
            </p>
          </div>

        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'All', label: 'All Entries' },
            { id: 'Visited', label: 'Visited ✅' },
            { id: 'Planned', label: 'Planned 📅' },
            { id: 'BucketList', label: 'Bucket List ⭐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          {filteredTrips.length} {filteredTrips.length === 1 ? 'Trip' : 'Trips'} Found
        </span>
      </div>

      {/* Trips Timeline Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs">Loading your trip history...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="p-16 text-center bg-slate-900 rounded-3xl border border-slate-800 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white">No trips recorded in this category</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Browse our list of countries (France, Egypt, Germany, Switzerland, USA, UAE) and click <strong>"Add to My Trips"</strong> to build your journey!
          </p>
          <button
            onClick={onNavigateToCountries}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20"
          >
            Explore Countries Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const isVisited = trip.status === 'Visited';
            const isPlanned = trip.status === 'Planned';

            return (
              <div
                key={trip.id}
                className="bg-slate-900 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={trip.imageUrl}
                      alt={trip.placeName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                    {/* Status Pill (Clickable to toggle!) */}
                    <div className="absolute top-3 left-3">
                      <button
                        onClick={() => handleToggleStatus(trip)}
                        title="Click to toggle status (Visited / Planned)"
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all ${
                          isVisited
                            ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                            : isPlanned
                            ? 'bg-sky-500/90 text-white hover:bg-sky-600'
                            : 'bg-purple-500/90 text-white hover:bg-purple-600'
                        }`}
                      >
                        {isVisited && <CheckCircle className="w-3 h-3" />}
                        {isPlanned && <Clock className="w-3 h-3" />}
                        <span>{trip.statusName} (Toggle)</span>
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 hover:bg-rose-500/80 text-slate-300 hover:text-white backdrop-blur-md transition-all"
                      title="Delete trip from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
                        <span>{trip.flagEmoji}</span>
                        <span>{trip.city}, {trip.countryName}</span>
                      </div>
                      <h3 className="text-lg font-black text-white truncate drop-shadow-md">
                        {trip.placeName}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3.5">
                    
                    {/* Date and Rating Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        <span>
                          {trip.visitDate 
                            ? new Date(trip.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'Date not set'}
                        </span>
                      </div>

                      {trip.userRating && (
                        <div className="flex items-center gap-0.5">
                          {[...Array(trip.userRating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Personal Journal Notes */}
                    {trip.notes ? (
                      <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 mb-1">
                          <FileText className="w-3 h-3 text-sky-400" />
                          <span>Personal Notes & Memories:</span>
                        </div>
                        <p className="italic">"{trip.notes}"</p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">
                        No notes added yet.
                      </div>
                    )}

                    {/* Metadata Pills: Travel Mode, Buddy, Spend */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-[11px]">
                      {trip.travelMode && (
                        <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300">
                          <Car className="w-3 h-3 text-sky-400" />
                          <span>{trip.travelMode}</span>
                        </span>
                      )}
                      {trip.travelBuddy && (
                        <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg text-slate-300">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span>{trip.travelBuddy}</span>
                        </span>
                      )}
                      {trip.actualCostUSD !== undefined && (
                        <span className="flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-300 font-bold ml-auto">
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          <span>${trip.actualCostUSD.toFixed(2)}</span>
                        </span>
                      )}
                    </div>

                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleToggleStatus(trip)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all text-center"
                  >
                    Mark as {isVisited ? 'Planned' : 'Visited'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
