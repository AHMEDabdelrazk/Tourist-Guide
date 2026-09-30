import React, { useState, useEffect } from 'react';
import { PlaceSummary, CountrySummary } from '../types';
import { api } from '../services/api';
import { 
  Search, 
  MapPin, 
  Star, 
  DollarSign, 
  Navigation, 
  Clock, 
  Filter, 
  PlusCircle, 
  Sparkles, 
  ArrowUpDown 
} from 'lucide-react';

interface PlacesTabProps {
  onSelectPlace: (placeId: number) => void;
  onOpenAddToTrip: (placeId: number) => void;
}

export const PlacesTab: React.FC<PlacesTabProps> = ({ onSelectPlace, onOpenAddToTrip }) => {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating_desc');

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'Historical', label: 'Historical 🏛️' },
    { id: 'WonderOfTheWorld', label: 'Wonders 🌟' },
    { id: 'Nature', label: 'Nature 🏞️' },
    { id: 'Cultural', label: 'Cultural 🎨' },
    { id: 'Adventure', label: 'Adventure ⛷️' }
  ];

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [searchTerm, selectedCountryCode, selectedCategory, sortBy]);

  const loadCountries = async () => {
    try {
      const data = await api.getCountries();
      setCountries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const data = await api.getPlaces({
        searchTerm: searchTerm.trim() || undefined,
        countryCode: selectedCountryCode || undefined,
        category: selectedCategory || undefined,
        sortBy
      });
      setPlaces(data);
    } catch (err) {
      console.error('Error fetching places:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 inline-block mb-2">
            Top Places & Transit Directions
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Discover Global Attractions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search top attractions with comprehensive public transit directions, metro lines, and admission prices
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search place, city, or keyword..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Country Selector */}
          <div>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="">All Countries (France, Egypt, Germany, etc.)</option>
              {countries.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.flagEmoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="rating_desc">Highest Rated ⭐</option>
              <option value="price_asc">Price: Low to High 💵</option>
              <option value="price_desc">Price: High to Low 💰</option>
              <option value="name_asc">Name: A to Z 🔤</option>
            </select>
          </div>
        </div>
      </div>

      {/* Places Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs">Filtering destinations...</p>
        </div>
      ) : places.length === 0 ? (
        <div className="p-16 text-center bg-slate-900 rounded-3xl border border-slate-800">
          <p className="text-slate-300 font-bold mb-1">No destinations match your filters</p>
          <p className="text-slate-500 text-xs">Try clearing search terms or picking another country.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-sky-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-sky-300 border border-slate-700">
                    <span>{place.flagEmoji}</span>
                    <span>{place.countryName}</span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-amber-400 border border-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{place.rating.toFixed(1)}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {place.city}
                    </span>
                    <h3 className="text-lg font-black text-white truncate drop-shadow-md">
                      {place.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3.5">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {place.summary}
                  </p>

                  {/* HOW TO GO THERE TRANSIT HIGHLIGHT BOX */}
                  <div className="bg-sky-950/30 border border-sky-500/20 rounded-2xl p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
                      <Navigation className="w-3 h-3 text-sky-400" />
                      <span className="uppercase tracking-wider text-[10px]">How to Go There:</span>
                    </div>
                    <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                      {place.howToGoThere}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1 font-semibold text-slate-200">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{place.ticketPriceUSD === 0 ? 'Free Entry' : `$${place.ticketPriceUSD.toFixed(2)}`}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{place.recommendedDuration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => onSelectPlace(place.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenAddToTrip(place.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add to Trips</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
