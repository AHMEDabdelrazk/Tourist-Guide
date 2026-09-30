import React, { useState, useEffect } from 'react';
import { TripStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Luggage, 
  Calendar, 
  DollarSign, 
  Star, 
  MapPin, 
  Car, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AddToTripModalProps {
  placeId: number | null;
  onClose: () => void;
  onSuccess: () => void;
  onOpenAuth: () => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({
  placeId,
  onClose,
  onSuccess,
  onOpenAuth
}) => {
  const { isAuthenticated } = useAuth();
  const [placeName, setPlaceName] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');
  const [ticketPrice, setTicketPrice] = useState<number>(0);

  const [status, setStatus] = useState<TripStatus>('Planned');
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(5);
  const [actualCost, setActualCost] = useState<string>('0');
  const [travelMode, setTravelMode] = useState<string>('Flight');
  const [travelBuddy, setTravelBuddy] = useState<string>('Solo');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    api.getPlaceById(placeId)
      .then((p) => {
        setPlaceName(p.name);
        setCityName(p.city);
        setTicketPrice(p.ticketPriceUSD);
        setActualCost(p.ticketPriceUSD.toString());
      })
      .catch((err) => console.error(err));
  }, [placeId]);

  if (!placeId) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-sky-500/30">
            <Luggage className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Sign In Required</h3>
          <p className="text-xs text-slate-400 mb-6">
            Please sign in or use the 1-click Demo Login to add destinations to your personal Trip History.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => { onClose(); onOpenAuth(); }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-lg"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.addToTrips({
        placeId,
        status,
        visitDate: visitDate || undefined,
        notes: notes.trim() || undefined,
        userRating: status === 'Visited' ? userRating : undefined,
        actualCostUSD: parseFloat(actualCost) || ticketPrice,
        travelMode,
        travelBuddy
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 flex-shrink-0">
            <Luggage className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
              Trip Itinerary & History
            </span>
            <h2 className="text-xl font-black text-white leading-tight">
              Add to My Travel History
            </h2>
            <p className="text-xs text-slate-400 truncate max-w-xs">
              {placeName} ({cityName})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Status Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Trip Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Visited', label: 'Visited ✅', color: 'from-emerald-600 to-teal-700' },
                { id: 'Planned', label: 'Planned 📅', color: 'from-sky-600 to-indigo-700' },
                { id: 'BucketList', label: 'Bucket List ⭐', color: 'from-purple-600 to-pink-700' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id as TripStatus)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    status === item.id
                      ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-md scale-[1.02]`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Budget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                {status === 'Visited' ? 'Date Visited' : 'Target Date'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Estimated / Actual Cost ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Travel Mode & Companion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Transit / Transport Mode
              </label>
              <div className="relative">
                <Car className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  value={travelMode}
                  onChange={(e) => setTravelMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="Flight">Flight ✈️</option>
                  <option value="Scenic Train">Scenic Train 🚆</option>
                  <option value="Metro / Subway">Metro / Subway 🚇</option>
                  <option value="Rental Car">Rental Car 🚗</option>
                  <option value="Tour Bus">Tour Coach 🚌</option>
                  <option value="Cruise / Ferry">Cruise / Boat 🚢</option>
                  <option value="Walking / Hiking">Walking / Hiking 🥾</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Travel Companion
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  value={travelBuddy}
                  onChange={(e) => setTravelBuddy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="Solo">Solo Traveler</option>
                  <option value="Partner">With Partner</option>
                  <option value="Family">Family Trip</option>
                  <option value="Friends">Friends Group</option>
                  <option value="Guided Group">Organized Group Tour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rating (if Visited) */}
          {status === 'Visited' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Personal Rating
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 ml-2 font-semibold">
                  {userRating} of 5 Stars
                </span>
              </div>
            </div>
          )}

          {/* Notes & Memories */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Personal Notes, Memories & Itinerary Plans
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you love? Any secret spot, photo spot, or transport tip to remember?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving Trip...' : 'Save to History'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
